import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),
  customer: Joi.string().required(),
  status: Joi.string().required(),
  limitMau: Joi.number().required(),
  unusedMau: Joi.number().required(),
  periodEnd: Joi.date(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
});

export default schema;
