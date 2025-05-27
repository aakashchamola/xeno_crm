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

async function publishToQueue(queue, data) {
  const ch = await getChannel();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
}

module.exports = { publishToQueue, closeConnection };