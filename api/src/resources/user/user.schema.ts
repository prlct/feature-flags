import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  sessionId: Joi.string().required(),
  externalId: Joi.string().required(),
  email: Joi.string().required(),
  fullName: Joi.string().required(),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
});

export default schema;
