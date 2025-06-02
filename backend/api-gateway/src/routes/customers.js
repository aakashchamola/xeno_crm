const express = require('express');
const router = express.Router();
const  {validateCustomer }= require('../validators/customer');
const { authenticateJWT } = require('../middlewares/authenticate');
const { createCustomer, getCustomers, searchCustomers } = require('../controllers/customersController');


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

router.get('/search', authenticateJWT, searchCustomers);

module.exports = router;