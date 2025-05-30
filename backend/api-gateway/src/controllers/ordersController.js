const { publishToQueue } = require('../utils/publisher');

async function createOrder(req, res, next) {
  try {
    const { customerId, orderDetails } = req.body;
    const db = req.app.locals.db;

    // Validate customerId exists in the database
    const [customerRows] = await db.query('SELECT id FROM customers WHERE id = ?', [customerId]);
    if (!customerRows.length) {
      return res.status(400).json({ error: 'Invalid customerId: no such customer exists.' });
    }

    // Additional validation for orderDetails (if required)
    if (!orderDetails || typeof orderDetails !== 'object') {
      return res.status(400).json({ error: 'Invalid orderDetails: must be a valid object.' });
    }

    // Publish the order to RabbitMQ
    await publishToQueue('orders', req.body);
    res.status(202).json({ message: 'Order data accepted for processing.' });
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to enqueue order data.';
    return next(err);
  }
}

async function getOrders(req, res, next) {
  try {
    const [rows] = await req.app.locals.db.query('SELECT * FROM orders');
    res.json(rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to fetch orders.';
    return next(err);
  }
}

module.exports = { createOrder, getOrders };
