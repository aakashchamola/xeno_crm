const { publishToQueue } = require('../utils/publisher');

async function createDeliveryReceipt(req, res, next) {
  try {
    await publishToQueue('deliveryReceipts', req.body);
    res.status(202).json({ message: 'Delivery receipt accepted for processing.' });
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to enqueue delivery receipt.';
    return next(err);
  }
}

async function updateDeliveryReceipt(req, res, next) {
  try {
    const { receiptId, status } = req.body;
    const db = req.app.locals.db;

    // Validate receiptId exists in the database
    const [receiptRows] = await db.query('SELECT id FROM delivery_receipts WHERE id = ?', [receiptId]);
    if (!receiptRows.length) {
      return res.status(400).json({ error: 'Invalid receiptId: no such receipt exists.' });
    }

    // Publish the delivery receipt update to RabbitMQ
    await publishToQueue('delivery-receipts', req.body);
    res.status(202).json({ message: 'Delivery receipt update accepted for processing.' });
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to enqueue delivery receipt update.';
    return next(err);
  }
}

module.exports = { createDeliveryReceipt, updateDeliveryReceipt };