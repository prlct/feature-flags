import Joi from 'joi';

const SubscriptionLimitsSchema = {
  emails: Joi.number().allow(null).default(null),
  mau: Joi.number().required(),
  pipelines: Joi.number().allow(null).default(null),
  users: Joi.number().allow(null).default(null),
};

const schema = Joi.object({
  _id: Joi.string().required(),
  companyId: Joi.string().required(),
  subscriptionId: Joi.string().required(),
  planId: Joi.string().required(),
  productId: Joi.string().required(),
  customer: Joi.string().required(),
  status: Joi.string().required(),
  subscriptionLimits: SubscriptionLimitsSchema,
  name: Joi.string().allow('').default(''),
  interval: Joi.string().required(),
  startDate: Joi.number().required(),
  endDate: Joi.number().required(),
  cancelAtPeriodEnd: Joi.bool().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
});

export default schema;
