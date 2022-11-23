import Joi from 'joi';

const schema = Joi.object({
  id: Joi.string().required(),
  applicationId: Joi.string().required(),
  pipelineId: Joi.string().required(),
  name: Joi.string().required(),
  enabled: Joi.bool().required(),

  trigger: Joi.object({
    name: Joi.string().required(),
    key: Joi.string().required(),
    eventName: Joi.string(),
    eventKey: Joi.string(),
    allowRepeat: Joi.bool(),
    repeatDelay: Joi.number(),
  }),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});


export default schema;
