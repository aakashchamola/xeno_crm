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
  try {
    await pool.query(
      'INSERT INTO communication_log (campaign_id, customer_id, message, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [campaign_id, customer_id, message, status]
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.warn('Duplicate communication_log:', campaign_id, customer_id);
      return;
    }
    throw err;
  }
}

async function updateDeliveryStatus(receipt) {
  // Normalize keys to snake_case for DB
  const campaign_id = receipt.campaign_id || receipt.campaignId;
  const customer_id = receipt.customer_id || receipt.customerId;
  const status = receipt.status;
  await pool.query(
    'UPDATE communication_log SET status = ? WHERE campaign_id = ? AND customer_id = ?',
    [status, campaign_id, customer_id]
  );
}

module.exports = { saveCommunicationLog, updateDeliveryStatus };