const Joi = require('joi');

const campaignSchema = Joi.object({
  name: Joi.string().required(),
  segmentRules: Joi.object({
    combinator: Joi.string().valid('and', 'or').required(),
    rules: Joi.array().items(
      Joi.object({
        field: Joi.string().required(),
        op: Joi.string().valid('>', '<', '=', '>=', '<=').required(),
        value: Joi.any().required()
      })
    ).min(1).required()
  }).required(),
  message: Joi.string().required(),
  customerIds: Joi.array().items(Joi.string()).required()
});
function validateCampaign(req, res, next) {
  const { error } = campaignSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = { validateCampaign };