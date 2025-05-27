const express = require('express');
const router = express.Router();
const { validateCampaign } = require('../validators/campaign');
const { authenticateJWT } = require('../middlewares/authenticate');
const { createCustomer } = require('../controllers/customersController');

router.post(
  '/',
  authenticateJWT,
  validateCampaign,
  createCampaign
);

module.exports = router;