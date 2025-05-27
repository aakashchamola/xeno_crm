const amqp = require('amqplib');
const { saveCustomer, saveOrder } = require('./db');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function start() {
  const conn = await amqp.connect(RABBITMQ_URL);
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
        console.error('Failed to save customer:', err);
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
        console.error('Failed to save order:', err);
        channel.nack(msg, false, false);
      }
    }
  });

  console.log('Ingestion consumer started. Listening for customers and orders...');
}

start().catch(console.error);