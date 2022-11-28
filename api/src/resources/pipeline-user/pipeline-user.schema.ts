import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  email: Joi.string().email().required(),
  pipeline: Joi.string(),
  sequence: Joi.string(),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
