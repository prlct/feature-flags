import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  firstName: Joi.string().trim().allow(''),
  lastName: Joi.string().trim().allow(''),
  email: Joi.string().email().required(),

  pipelines: Joi.array().items(Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    droppedOn: Joi.date().allow(null),
  })).default(null),

  sequences: Joi.array().items(Joi.object({
    _id: Joi.string(),
    name: Joi.string(),
    pipelineId: Joi.string(),
    finishedOn: Joi.date().allow(null),
    droppedOn: Joi.date().allow(null),
    pendingEmail: Joi.string().allow(null),
    lastEmail: Joi.string().allow(null),
  })),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
