const amqp = require('amqplib');
const axios = require('axios');
const mysql = require('mysql2/promise');
const { saveCommunicationLog, updateDeliveryStatus } = require('./db');

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

// Simple rule engine for segmentRules
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
      params.push(rule.value);
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
          const [rows] = await pool.query(`SELECT id FROM customers WHERE ${clause}`, params);
          customerIds = rows.map(r => r.id);
        }

        // 3. Insert communication_log and fan-out to vendor
        let sent = 0, failed = 0;
        for (const customer_id of customerIds) {
          try {
            await saveCommunicationLog({ campaign_id, customer_id, message: campaign.message, status: 'sent' });
            // Fan-out to vendor
            await axios.post(VENDOR_API_URL, {
              campaignId: campaign_id,
              customerId: customer_id,
              message: campaign.message,
            });
            sent++;
          } catch (err) {
            failed++;
            await saveCommunicationLog({ campaign_id, customer_id, message: campaign.message, status: 'failed' });
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

start().catch(console.error);