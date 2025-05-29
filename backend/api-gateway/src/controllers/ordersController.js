const { publishToQueue } = require('../utils/publisher');

async function createOrder(req, res) {
  try {
    await publishToQueue('orders', req.body);
    res.status(202).json({ message: 'Order data accepted for processing.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enqueue order data.' });
  }
}
async function getOrders(req, res) {
  try {
    const [rows] = await req.app.locals.db.query('SELECT * FROM orders');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
}

module.exports = { createOrder, getOrders };
