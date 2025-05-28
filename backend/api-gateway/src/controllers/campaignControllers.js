const { publishToQueue } = require('../utils/publisher');

async function createCampaign(req, res) {
  try {
    await publishToQueue('campaigns', req.body);
    res.status(202).json({ message: 'Campaign data accepted for processing.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enqueue campaign data.' });
  }
}
async function getCampaigns(req, res) {
  try {
    const [rows] = await req.app.locals.db.query('SELECT * FROM campaigns');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaigns.' });
  }
}

module.exports = { createCampaign, getCampaigns };
