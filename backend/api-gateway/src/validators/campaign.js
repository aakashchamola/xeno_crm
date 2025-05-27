const Joi = require('joi');

const campaignSchema = Joi.object({
  name: Joi.string().required(),
  segmentRules: Joi.array().items(Joi.object()).required(),
  message: Joi.string().required(),
  // Add more fields as needed
});

function validateCampaign(req, res, next) {
  const { error } = campaignSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = { validateCampaign };