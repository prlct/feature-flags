import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  pipelineId: Joi.string().required(),
  name: Joi.string().required(),
  enabled: Joi.bool().required(),
  total: Joi.number().integer().default(0),
  dropped: Joi.number().integer().default(0),
  completed: Joi.number().integer().default(0),
  trigger: Joi.object({
    name: Joi.string().required(),
    eventName: Joi.string(),
    eventKey: Joi.string(),
    allowRepeat: Joi.bool(),
    repeatDelay: Joi.number().min(0),
    description: Joi.string().allow('').default(''),
  }).allow(null).default(null),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});


export default schema;
