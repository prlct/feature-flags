import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),
  applicationId: Joi.string().required(),
  email: Joi.string(),
  externalId: Joi.string().required(),
  env: Joi.string().required(),
  data: Joi.object(),
  lastVisitedOn: Joi.date(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
});

export default schema;
