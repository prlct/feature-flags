import Joi from 'joi';
import { UserEventType } from './user-event.types';

const schema = Joi.object({
  _id: Joi.string().required(),
  userId: Joi.string().required(),
  type: Joi.string().valid(...Object.values(UserEventType)),
  applicationId: Joi.string().required(),
  env: Joi.string().required(),
  data: Joi.object({
    featureId: Joi.string(),
    featureName: Joi.string(),
  }),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
});

export default schema;