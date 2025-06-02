const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://api-gateway:8002/deliveryReceipts';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_jwt_secret';

// Generate a service JWT at startup
const serviceJwt = jwt.sign(
  { service: 'vendor-simulator' },
  JWT_SECRET,
  { expiresIn: '7d' }
);

function logWithTime(...args) {
  console.log(`[${new Date().toISOString()}]`, ...args);
}
function errorWithTime(...args) {
  console.error(`[${new Date().toISOString()}]`, ...args);
}

function isValidSendPayload(obj) {
  return obj && obj.campaignId && obj.customerId && typeof obj.message === 'string';
}

app.post('/send', async (req, res) => {
  logWithTime('Incoming /send request:', JSON.stringify(req.body));
  const { campaignId, customerId, message } = req.body;
  if (!isValidSendPayload(req.body)) {
    errorWithTime('Invalid payload for /send:', JSON.stringify(req.body));
    return res.status(400).json({ error: 'Missing campaignId, customerId, or message' });
  }
  // Simulate delivery result: 90% sent, 10% failed
  const isSuccess = Math.random() < 0.9;
  const status = isSuccess ? 'sent' : 'failed';

  // Simulate network delay
  setTimeout(async () => {
    try {
      logWithTime('Posting delivery receipt to API Gateway:', {
        API_GATEWAY_URL,
        campaignId,
        customerId,
        status,
        timestamp: new Date().toISOString(),
      });
      const response = await axios.post(API_GATEWAY_URL, {
        campaignId: String(campaignId),
  customerId: String(customerId),
        status,
        timestamp: new Date().toISOString(),
      }, {
        headers: { 'Authorization': `Bearer ${serviceJwt}` }
      });
      logWithTime(`Receipt sent for customer ${customerId}: ${status}. API Gateway responded with status ${response.status}`);
    } catch (err) {
      errorWithTime('Failed to send delivery receipt:', err.message, err.response?.data || '');
    }
  }, Math.random() * 1000 + 500); // 0.5-1.5s delay

  res.json({ vendorStatus: status });
});

app.get('/health', (req, res) => {
  logWithTime('Health check requested');
  res.send('OK');
});

const PORT = process.env.PORT || 8005;
app.listen(PORT, () => {
  logWithTime(`Vendor Simulator running on port ${PORT}`);
});