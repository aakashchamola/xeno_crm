const { publishToQueue } = require('../utils/publisher');

async function createCustomer(req, res, next) {
  try {
    const { email } = req.body;
    const db = req.app.locals.db;

    // Validate email uniqueness in the database
    const [emailRows] = await db.query('SELECT id FROM customers WHERE email = ?', [email]);
    if (emailRows.length) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Publish the customer to RabbitMQ
    await publishToQueue('customers', req.body);
    res.status(202).json({ message: 'Customer data accepted for processing.' });
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to enqueue customer data.';
    return next(err);
  }
}

async function getCustomers(req, res, next) {
  try {
    // No user input in query, so safe
    const [rows] = await req.app.locals.db.query('SELECT * FROM customers');
    res.json(rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to fetch customers.';
    return next(err);
  }
}

module.exports = { createCustomer, getCustomers };
