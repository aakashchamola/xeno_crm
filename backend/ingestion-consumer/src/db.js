const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'xeno_crm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function saveCustomer(customer) {
  const { name, email, phone } = customer;
  await pool.query(
    'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
    [name, email, phone || null]
  );
}

async function saveOrder(order) {
  const { orderId, customerId, amount, date } = order;
  await pool.query(
    'INSERT INTO orders (order_id, customer_id, amount, date) VALUES (?, ?, ?, ?)',
    [orderId, customerId, amount, date]
  );
}

module.exports = { saveCustomer, saveOrder };