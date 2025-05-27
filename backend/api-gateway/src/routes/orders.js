const express = require('express');
const router = express.Router();
const { validateOrder } = require('../validators/order');
const { authenticateJWT } = require('../middlewares/authenticate');
const { createOrder } = require('../controllers/ordersController');

router.post(
  '/',
  authenticateJWT,
  validateOrder,
  createOrder
);

module.exports = router;