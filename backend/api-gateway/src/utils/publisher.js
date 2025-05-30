const amqp = require('amqplib');

let channel;
let connection;

async function getChannel() {
  if (channel) return channel;
  connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();
  return channel;
}
async function closeConnection() {
  if (channel) await channel.close();
  if (connection) await connection.close();
}

// Retry utility for async functions
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

async function publishToQueue(queue, data, options = { retries: 3, delay: 500 }) {
  await retryAsync(async () => {
    const ch = await getChannel();
    await ch.assertQueue(queue, { durable: true });
    const ok = ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
    if (!ok) throw new Error('Failed to send to queue');
  }, options.retries, options.delay);
}

module.exports = { publishToQueue, closeConnection };