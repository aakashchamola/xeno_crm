const { publishToQueue } = require('../utils/publisher');

async function createDeliveryReceipt(req, res) {
  try {
    await publishToQueue('deliveryReceipts', req.body);
    res.status(202).json({ message: 'Delivery receipt accepted for processing.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enqueue delivery receipt.' });
  }
}

module.exports = { createDeliveryReceipt };