const Joi = require('joi');

const customerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  spend: Joi.number().optional(),
  visits: Joi.number().optional(),
  last_active: Joi.date().optional()
});

function validateCustomer(req, res, next) {
  const { error } = customerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = { validateCustomer };