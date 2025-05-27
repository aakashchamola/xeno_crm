const Joi = require('joi');

const deliveryReceiptSchema = Joi.object({
  campaignId: Joi.string().required(),
  customerId: Joi.string().required(),
  status: Joi.string().valid('sent', 'failed').required(),
  timestamp: Joi.date().required(),
  // Add more fields as needed
});

function validateDeliveryReceipt(req, res, next) {
  const { error } = deliveryReceiptSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = { validateDeliveryReceipt };