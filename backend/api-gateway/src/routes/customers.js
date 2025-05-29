const express = require('express');
const router = express.Router();
const  {validateCustomer }= require('../validators/customer');
const { authenticateJWT } = require('../middlewares/authenticate');
const { createCustomer, getCustomers } = require('../controllers/customersController');


router.post(
  '/',
  authenticateJWT,
  validateCustomer,
  createCustomer
);
router.get(
  '/',
  authenticateJWT,
  getCustomers
);

module.exports = router;