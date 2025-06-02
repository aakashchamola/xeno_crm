const { publishToQueue } = require('../utils/publisher');
const { randomUUID } = require('crypto');

async function createCustomer(req, res, next) {
  try {
    const { email } = req.body;
    const db = req.app.locals.db;

    // Validate email uniqueness in the database
    const [emailRows] = await db.query('SELECT id FROM customers WHERE email = ?', [email]);
    if (emailRows.length) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Generate unique customer_id
    const customer_id = `CUST-${randomUUID()}`;
    // Add to payload
    const payload = { ...req.body, customer_id };

    // Publish the customer to RabbitMQ
    await publishToQueue('customers', payload);
    res.status(202).json({ message: 'Customer data accepted for processing.', customer_id });
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

async function searchCustomers(req, res, next) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const db = req.app.locals.db;
    const [rows] = await db.query(
      `SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    res.json(rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to search customers.';
    return next(err);
  }
}

module.exports = { createCustomer, getCustomers, searchCustomers };
