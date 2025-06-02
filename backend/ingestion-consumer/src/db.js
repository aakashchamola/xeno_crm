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
  // Accepts: { customer_id, name, email, phone, spend, visits, last_active }
  const { customer_id, name, email, phone, spend = 0, visits = 0, last_active = null } = customer;
  try {
    await pool.query(
      'INSERT INTO customers (customer_id, name, email, phone, spend, visits, last_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customer_id, name, email, phone || null, spend, visits, last_active]
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.warn('Duplicate customer:', email, customer_id);
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

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insert order
    await conn.query(
      'INSERT INTO orders (order_id, customer_id, amount, date) VALUES (?, ?, ?, ?)',
      [orderId, customerId, amount, mysqlDate]
    );

    // 2. Update customer spend, visits, last_purchase_date, inactive_days
    await conn.query(
      `UPDATE customers
       SET spend = spend + ?,
           visits = visits + 1,
           last_purchase_date = ?,
           inactive_days = DATEDIFF(CURDATE(), ?)
       WHERE id = ?`,
      [amount, mysqlDate, mysqlDate, customerId]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      console.warn('Duplicate order:', orderId);
      return;
    }
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { saveCustomer, saveOrder };