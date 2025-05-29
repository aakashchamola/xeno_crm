const express = require('express');
const router = express.Router();
const { validateCampaign } = require('../validators/campaign');
const { authenticateJWT } = require('../middlewares/authenticate');
const { createCampaign, getCampaigns, getCampaignById } = require('../controllers/campaignControllers');

router.post(
  '/',
  authenticateJWT,
  validateCampaign,
  createCampaign
);

router.get(
  '/',
  authenticateJWT,
  getCampaigns
);

router.get('/:id', authenticateJWT, getCampaignById);

module.exports = router;