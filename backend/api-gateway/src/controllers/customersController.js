const { publishToQueue } = require('../utils/publisher');

async function createCustomer(req, res) {
  try {
    await publishToQueue('customers', req.body);
    res.status(202).json({ message: 'Customer data accepted for processing.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enqueue customer data.' });
  }
}

module.exports = { createCustomer };