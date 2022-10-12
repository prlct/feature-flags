import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),
  applicationId: Joi.string().required(),
  mau: Joi.number().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
});

export default schema;
