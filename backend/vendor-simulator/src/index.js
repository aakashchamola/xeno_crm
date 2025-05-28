const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://api-gateway:3001/delivery-receipts';

app.post('/send', async (req, res) => {
  const { campaignId, customerId, message } = req.body;

  // Simulate delivery result: 90% sent, 10% failed
  const isSuccess = Math.random() < 0.9;
  const status = isSuccess ? 'sent' : 'failed';

  // Simulate network delay
  setTimeout(async () => {
    try {
      await axios.post(API_GATEWAY_URL, {
        campaignId,
        customerId,
        status,
        timestamp: new Date().toISOString(),
      }, {
        headers: { 'Authorization': req.headers['authorization'] || '' }
      });
      console.log(`Receipt sent for customer ${customerId}: ${status}`);
    } catch (err) {
      console.error('Failed to send delivery receipt:', err.message);
    }
  }, Math.random() * 1000 + 500); // 0.5-1.5s delay

  res.json({ vendorStatus: status });
});

app.get('/health', (req, res) => {
  res.send('OK');
});


const PORT = process.env.PORT || 8005;
app.listen(PORT, () => {
  console.log(`Vendor Simulator running on port ${PORT}`);
});