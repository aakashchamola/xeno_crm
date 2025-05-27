const express = require('express');
const router = express.Router();
const { validateDeliveryReceipt } = require('../validators/deliveryReceipt');
const { authenticateJWT } = require('../middlewares/authenticate');
const { createDeliveryReceipt } = require('../controllers/deliveryReceiptsController');

router.post(
  '/',
  authenticateJWT,
  validateDeliveryReceipt,
  createDeliveryReceipt
);

module.exports = router;