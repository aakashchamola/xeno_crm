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
async function getCampaignById(req, res) {
  try {
    const [rows] = await req.app.locals.db.query('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Campaign not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaign.' });
  }
}

module.exports = { createCampaign, getCampaigns, getCampaignById };

