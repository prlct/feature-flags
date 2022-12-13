import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  email: Joi.string().email().required(),
  pipeline: Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
  }).default(null),
  sequence: Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    lastEmailId: Joi.string().allow(null),
    pendingEmailId: Joi.string().allow(null),
  }).default(null),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
