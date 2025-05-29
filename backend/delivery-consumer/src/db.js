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

async function saveCommunicationLog({ campaign_id, customer_id, message, status = 'sent' }) {
  await pool.query(
    'INSERT INTO communication_log (campaign_id, customer_id, message, status, created_at) VALUES (?, ?, ?, ?, NOW())',
    [campaign_id, customer_id, message, status]
  );
}

async function updateDeliveryStatus({ campaign_id, customer_id, status }) {
  await pool.query(
    'UPDATE communication_log SET status = ? WHERE campaign_id = ? AND customer_id = ?',
    [status, campaign_id, customer_id]
  );
}

module.exports = { saveCommunicationLog, updateDeliveryStatus };