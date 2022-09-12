import Joi from 'joi';
import { EventType } from './user-event.types';

const schema = Joi.object({
  _id: Joi.string().required(),
  userId: Joi.string().required(),
  event: Joi.string().valid(...Object.values(EventType)),
  data: Joi.object({
    featureId: Joi.string(),
    featureName: Joi.string(),
  }),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
});

export default schema;