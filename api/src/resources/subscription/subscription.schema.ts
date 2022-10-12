import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),
  subscriptionId: Joi.string().required(),
  planId: Joi.string().required(),
  productId: Joi.string().required(),
  customer: Joi.string().required(),
  status: Joi.string().required(),
  interval: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  cancelAtPeriodEnd: Joi.bool().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
});

export default schema;
