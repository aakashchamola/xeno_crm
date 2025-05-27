const express = require('express');
const router = express.Router();
const { validateCampaign } = require('../validators/campaign');
const { authenticateJWT } = require('../middlewares/authenticate');
const { createCampaign } = require('../controllers/campaignControllers');

router.post(
  '/',
  authenticateJWT,
  validateCampaign,
  createCampaign
);

module.exports = router;