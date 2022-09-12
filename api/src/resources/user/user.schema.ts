import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),
  applicationId: Joi.string().required(),
  email: Joi.string().required(),
  env: Joi.string().required(),
  lastVisitedOn: Joi.date(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
});

export default schema;
