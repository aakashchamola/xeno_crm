const amqp = require('amqplib');
const axios = require('axios');
const { saveCommunicationLog, updateDeliveryStatus } = require('./db');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const VENDOR_API_URL = process.env.VENDOR_API_URL || 'http://vendor-simulator:4000/send';

async function start() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue('campaigns', { durable: true });
  await channel.assertQueue('deliveryReceipts', { durable: true });

  channel.consume('campaigns', async (msg) => {
    if (msg !== null) {
      try {
        const campaign = JSON.parse(msg.content.toString());
        await saveCommunicationLog(campaign);

        // Fan-out: send to each customer in the segment
        if (Array.isArray(campaign.customerIds)) {
          for (const customerId of campaign.customerIds) {
            // Prepare personalized message
            const payload = {
              campaignId: campaign.id,
              customerId,
              message: campaign.message,
            };
            // Call vendor-simulator API
            try {
              await axios.post(VENDOR_API_URL, payload);
            } catch (err) {
              console.error('Vendor API call failed:', err.message);
            }
          }
        }

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