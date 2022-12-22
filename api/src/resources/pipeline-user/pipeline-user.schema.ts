import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  firstName: Joi.string().trim().allow(''),
  lastName: Joi.string().trim().allow(''),
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
  finished: Joi.bool().empty(null).default(false),
  sequenceHistory: Joi.object({})
    .pattern(Joi.string().required(), Joi.date().required())
    .empty(null)
    .default({}),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
