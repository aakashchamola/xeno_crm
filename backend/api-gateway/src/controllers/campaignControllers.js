const { publishToQueue } = require('../utils/publisher');

async function createCampaign(req, res, next) {
  try {
    const { name, audienceSegmentId } = req.body;
    const db = req.app.locals.db;

    // Validate audienceSegmentId exists in the database
    const [segmentRows] = await db.query('SELECT id FROM audience_segments WHERE id = ?', [audienceSegmentId]);
    if (!segmentRows.length) {
      return res.status(400).json({ error: 'Invalid audienceSegmentId: no such segment exists.' });
    }

    // Publish the campaign to RabbitMQ
    await publishToQueue('campaigns', req.body);
    res.status(202).json({ message: 'Campaign data accepted for processing.' });
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to enqueue campaign data.';
    return next(err);
  }
}
async function getCampaigns(req, res, next) {
  try {
    // No user input in query, so safe
    const [rows] = await req.app.locals.db.query('SELECT * FROM campaigns');
    res.json(rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to fetch campaigns.';
    return next(err);
  }
}
async function getCampaignById(req, res, next) {
  try {
    const [rows] = await req.app.locals.db.query('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Campaign not found' });
    res.json(rows[0]);
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to fetch campaign.';
    return next(err);
  }
}

module.exports = { createCampaign, getCampaigns, getCampaignById };

