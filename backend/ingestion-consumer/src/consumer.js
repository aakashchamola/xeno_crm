const amqp = require('amqplib');
const { saveCustomer, saveOrder } = require('./db');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

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
        await saveCustomer(customer);
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
        await saveOrder(order);
        channel.ack(msg);
      } catch (err) {
        console.error(' Failed to save order:', err);
        channel.nack(msg, false, false);
      }
    }
  });

  console.log(' Ingestion consumer started. Listening for customers and orders...');
}

start().catch((err) => {
  console.error(' Unrecoverable startup error:', err);
  process.exit(1);
});