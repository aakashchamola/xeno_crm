const { publishToQueue } = require('../utils/publisher');

async function createCampaign(req, res) {
  try {
    await publishToQueue('campaigns', req.body);
    res.status(202).json({ message: 'Campaign data accepted for processing.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enqueue campaign data.' });
  }
}

module.exports = { createCampaign };