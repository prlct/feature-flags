import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  sequenceId: Joi.string().required(),
  delayDays: Joi.number().positive().integer(),
  name: Joi.string().required(),
  enabled: Joi.bool().required(),
  subject: Joi.string(),
  body: Joi.string(),
  sent: Joi.number().default(0),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
