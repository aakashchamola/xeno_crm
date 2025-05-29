const express = require('express');
const router = express.Router();
const { validateOrder } = require('../validators/order');
const { authenticateJWT } = require('../middlewares/authenticate');
const { createOrder, getOrders} = require('../controllers/ordersController');

router.post(
  '/',
  authenticateJWT,
  validateOrder,
  createOrder
);
router.get('/', authenticateJWT, getOrders);
module.exports = router;