const express = require('express');
const router = express.Router();
const { validateCustomer } = require('../validators/customer');
const { authenticateJWT } = require('../middlewares/authenticate');
const { createCustomer } = require('../controllers/customersController');

router.post(
  '/',
  authenticateJWT,
  validateCustomer,
  createCustomer
);

module.exports = router;