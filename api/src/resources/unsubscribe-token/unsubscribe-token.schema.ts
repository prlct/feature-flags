import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  emailId: Joi.string().required(),
  pipelineUserId: Joi.string().required(),
  sequenceId: Joi.string().required(),
  value: Joi.string().required(),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
