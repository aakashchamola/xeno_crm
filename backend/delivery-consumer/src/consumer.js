const amqp = require('amqplib');
const axios = require('axios');
const mysql = require('mysql2/promise');
const { saveCommunicationLog, updateDeliveryStatus } = require('./db');
const express = require('express');
const chrono = require('chrono-node');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const VENDOR_API_URL = process.env.VENDOR_API_URL || 'http://vendor-simulator:8005/send';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'xeno_crm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function isValidCampaign(obj) {
  return obj && typeof obj.name === 'string' && typeof obj.message === 'string';
}
function isValidReceipt(obj) {
  // Accept both camelCase and snake_case for compatibility
  return (
    obj &&
    ((obj.campaign_id && obj.customer_id) || (obj.campaignId && obj.customerId)) &&
    obj.status
  );
}
async function retryAsync(fn, retries = 3, delay = 500) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
      }
    }
  }
  throw lastErr;
}

// Simple rule engine for segmentRules
function normalizeValue(field, value) {
  // Only parse for date fields
  if (["last_purchase_date", "last_active"].includes(field) && typeof value === "string") {
    // If already ISO, return as is
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value;
    const parsed = chrono.parseDate(value);
    if (parsed) {
      // Format as YYYY-MM-DD
      return parsed.toISOString().slice(0, 10);
    }
  }
  return value;
}

function buildWhereClause(segmentRules) {
  if (!segmentRules || !Array.isArray(segmentRules.rules) || !segmentRules.rules.length) {
    return { clause: '1', params: [] }; // always true
  }
  const ops = { '>': '>', '<': '<', '=': '=', '>=': '>=', '<=': '<=' };
  const combinator = segmentRules.combinator === 'or' ? 'OR' : 'AND';
  const clauseParts = [];
  const params = [];
  for (const rule of segmentRules.rules) {
    if (rule.field && ops[rule.op] && rule.value !== undefined) {
      clauseParts.push(`\`${rule.field}\` ${ops[rule.op]} ?`);
      params.push(normalizeValue(rule.field, rule.value));
    }
  }
  return {
    clause: clauseParts.length ? clauseParts.join(` ${combinator} `) : '1',
    params
  };
}

async function connectWithRetry(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      console.log(' Connected to RabbitMQ');
      return conn;
    } catch (err) {
      console.error(` RabbitMQ connection failed (attempt ${i + 1}): ${err.message}`);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw new Error(' Could not connect to RabbitMQ after multiple attempts.');
      }
    }
  }
}

async function start() {
  const conn = await connectWithRetry();
  const channel = await conn.createChannel();

  await channel.assertQueue('campaigns', { durable: true });
  await channel.assertQueue('deliveryReceipts', { durable: true });

  channel.consume('campaigns', async (msg) => {
    if (msg !== null) {
      try {
        const campaign = JSON.parse(msg.content.toString());
        if (!isValidCampaign(campaign)) throw new Error('Invalid campaign data');

        // 1. Insert campaign into DB and get campaign_id
        const [result] = await pool.query(
          'INSERT INTO campaigns (name, message, segmentRules, audienceSize, sent, failed, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            campaign.name,
            campaign.message,
            JSON.stringify(campaign.segmentRules),
            0, // audienceSize (will update after)
            0, // sent
            0, // failed
            'pending'
          ]
        );
        const campaign_id = result.insertId;

        // 2. Get customer IDs if not provided
        let customerIds = Array.isArray(campaign.customerIds) && campaign.customerIds.length > 0
          ? campaign.customerIds
          : [];
        if (customerIds.length === 0 && campaign.segmentRules) {
          const { clause, params } = buildWhereClause(campaign.segmentRules);
          const [rows] = await pool.query(`SELECT customer_id FROM customers WHERE ${clause}`, params);
          customerIds = rows.map(r => r.customer_id);
        }

        // 3. Insert communication_log and fan-out to vendor
        let sent = 0, failed = 0;
        for (const customer_id of customerIds) {
          try {
     
            // Fan-out to vendor with retry
            await retryAsync(() => axios.post(VENDOR_API_URL, {
              campaignId: campaign_id,
              customerId: customer_id,
              message: campaign.message,
            }), 3, 500);
            // Only log as 'sent' if vendor-simulator succeeded
            await saveCommunicationLog({ campaign_id, customer_id, message: campaign.message, status: 'sent' });
            sent++;
          } catch (err) {
            // Log as 'failed' if vendor-simulator failed
            await saveCommunicationLog({ campaign_id, customer_id, message: campaign.message, status: 'failed' });
            failed++;
            console.error('Vendor API or log failed:', err.message);
          }
        }

        // 4. Update campaign stats
        await pool.query(
          'UPDATE campaigns SET audienceSize = ?, sent = ?, failed = ?, status = ? WHERE id = ?',
          [customerIds.length, sent, failed, 'completed', campaign_id]
        );

        channel.ack(msg);
      } catch (err) {
        console.error('Failed to process campaign:', err);
        channel.nack(msg, false, false);
      }
    }
  });

  channel.consume('deliveryReceipts', async (msg) => {
    if (msg !== null) {
      try {
        const receipt = JSON.parse(msg.content.toString());
        if (!isValidReceipt(receipt)) throw new Error('Invalid delivery receipt');
        await updateDeliveryStatus(receipt);
        channel.ack(msg);
      } catch (err) {
        console.error('Failed to update delivery status:', err);
        channel.nack(msg, false, false);
      }
    }
  });

  console.log('Delivery consumer started. Listening for campaigns and delivery receipts...');
}

// Health check server
const healthApp = express();
healthApp.get('/health', (req, res) => res.json({ status: 'ok' }));
healthApp.listen(8008, () => console.log('Delivery consumer health endpoint on 8008'));

start().catch(console.error);