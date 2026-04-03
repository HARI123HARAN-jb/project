const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ status: 'error', message: 'Validation Failed', errors: errorMessages });
    }
    next();
  };
};

module.exports = validateRequest;
