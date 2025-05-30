const amqp = require('amqplib');
const { saveCustomer, saveOrder } = require('./db');
const express = require('express');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

// Simple validation helpers
function isValidCustomer(obj) {
  return obj && typeof obj.name === 'string' && typeof obj.email === 'string';
}
function isValidOrder(obj) {
  return obj && obj.orderId && obj.customerId && obj.amount !== undefined && obj.date;
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

  await channel.assertQueue('customers', { durable: true });
  await channel.assertQueue('orders', { durable: true });

  channel.consume('customers', async (msg) => {
    if (msg !== null) {
      try {
        const customer = JSON.parse(msg.content.toString());
        if (!isValidCustomer(customer)) throw new Error('Invalid customer data');
        await retryAsync(() => saveCustomer(customer), 3, 500);
        channel.ack(msg);
      } catch (err) {
        console.error(' Failed to save customer:', err);
        channel.nack(msg, false, false);
      }
    }
  });

  channel.consume('orders', async (msg) => {
    if (msg !== null) {
      try {
        const order = JSON.parse(msg.content.toString());
        if (!isValidOrder(order)) throw new Error('Invalid order data');
        await retryAsync(() => saveOrder(order), 3, 500);
        channel.ack(msg);
      } catch (err) {
        console.error(' Failed to save order:', err);
        channel.nack(msg, false, false);
      }
    }
  });

  console.log(' Ingestion consumer started. Listening for customers and orders...');
}

// Health check server
const healthApp = express();
healthApp.get('/health', (req, res) => res.json({ status: 'ok' }));
healthApp.listen(8007, () => console.log('Ingestion consumer health endpoint on 8007'));

start().catch((err) => {
  console.error(' Unrecoverable startup error:', err);
  process.exit(1);
});