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

async function saveCommunicationLog(campaign) {
  // Example: Insert a new campaign log (expand as needed)
  await pool.query(
    'INSERT INTO communication_log (campaign_id, message, created_at) VALUES (?, ?, NOW())',
    [campaign.id || null, campaign.message]
  );
}

async function updateDeliveryStatus(receipt) {
  // Example: Update delivery status (expand as needed)
  await pool.query(
    'UPDATE communication_log SET status = ? WHERE campaign_id = ? AND customer_id = ?',
    [receipt.status, receipt.campaignId, receipt.customerId]
  );
}

module.exports = { saveCommunicationLog, updateDeliveryStatus };