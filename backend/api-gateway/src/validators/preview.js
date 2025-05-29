const Joi = require('joi');

const previewSchema = Joi.object({
  segmentRules: Joi.object({
    combinator: Joi.string().valid('and', 'or').required(),
    rules: Joi.array().items(
      Joi.object({
        field: Joi.string().required(),
        op: Joi.string().valid('>', '<', '=', '>=', '<=').required(),
        value: Joi.any().required()
      })
    ).min(1).required()
  }).required()
});

function validatePreview(req, res, next) {
  const { error } = previewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = { validatePreview };