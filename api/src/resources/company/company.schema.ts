import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  ownerId: Joi.string().required(),

  applicationIds: Joi.array().items(Joi.string()).unique().required(),
  adminIds: Joi.array().items(Joi.string()).min(1).unique().required(),
  stripeId: Joi.string().allow(null).default(null),
  freeLimitUsed: Joi.bool().allow(null).default(false),
  name: Joi.string().trim().max(200),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
