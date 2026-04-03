const Joi = require('joi');

const authValidation = {
  register: Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().email(),
    phone: Joi.string().required().pattern(/^[0-9]{10}$/).messages({ 'string.pattern.base': 'Phone number must be a valid 10-digit Indian number.' }),
    password: Joi.string().required().min(6)
  }),

  login: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    password: Joi.string().min(6)
  }).or('email', 'phone'),

  sendOtp: Joi.object({
    phone: Joi.string().required().pattern(/^[0-9]{10}$/)
  }),

  verifyOtp: Joi.object({
    phone: Joi.string().required().pattern(/^[0-9]{10}$/),
    otp: Joi.string().required().length(6)
  })
};

module.exports = authValidation;
