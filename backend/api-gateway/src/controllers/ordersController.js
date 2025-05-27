const { publishToQueue } = require('../utils/publisher');

async function createOrder(req, res) {
  try {
    await publishToQueue('orders', req.body);
    res.status(202).json({ message: 'Order data accepted for processing.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enqueue order data.' });
  }
}

module.exports = { createOrder };