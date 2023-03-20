const Joi = require('joi');
const { objectId } = require('./custom.validation');
const addLimitation = {
    body: Joi.object().keys({
      userId: Joi.string().custom(objectId),
      limitType: Joi.string().required(),
      value: Joi.string().required(),
    }),
  };

  module.exports = {
    addLimitation,
  };