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
  // Accepts: { name, email, phone, spend, visits, last_active }
  const { name, email, phone, spend = 0, visits = 0, last_active = null } = customer;
  try {
    await pool.query(
      'INSERT INTO customers (name, email, phone, spend, visits, last_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, spend, visits, last_active]
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.warn('Duplicate customer:', email);
      return;
    }
    throw err;
  }
}

async function saveOrder(order) {
  // Accepts: { orderId, customerId, amount, date }
  const { orderId, customerId, amount, date } = order;

  // Robust conversion to MySQL DATETIME format
  let mysqlDate = date;
  if (typeof date === 'string') {
    const d = new Date(date);
    if (!isNaN(d)) {
      // Pad function for 2-digit numbers
      const pad = n => n < 10 ? '0' + n : n;
      mysqlDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
  }
  try {
    await pool.query(
      'INSERT INTO orders (order_id, customer_id, amount, date) VALUES (?, ?, ?, ?)',
      [orderId, customerId, amount, mysqlDate]
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.warn('Duplicate order:', orderId);
      return;
    }
    throw err;
  }
}

module.exports = { saveCustomer, saveOrder };