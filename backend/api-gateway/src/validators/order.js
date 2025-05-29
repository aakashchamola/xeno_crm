const Joi = require('joi');

const orderSchema = Joi.object({
  orderId: Joi.string().required(),
customerId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  amount: Joi.number().required(),
  date: Joi.date().required(),
});

function validateOrder(req, res, next) {
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = { validateOrder };