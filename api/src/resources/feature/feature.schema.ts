import Joi from 'joi';
import { FeatureEnv } from './feature.types';

const envSettingsSchema = Joi.object({
  enabled: Joi.boolean().required().default(false),
  enabledForEveryone: Joi.boolean().required().default(false),
  users: Joi.array().items(Joi.string()).unique().required().default([]),
  usersPercentage: Joi.number().min(0).max(100).required().default(0),
  seenBy: Joi.number().required().default(0),
  tests: Joi.array().items(Joi.string()).unique().required().default([]),
});

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required().allow(''),
  envSettings: Joi.object({
    [FeatureEnv.DEVELOPMENT]: envSettingsSchema,
    [FeatureEnv.STAGING]: envSettingsSchema,
    [FeatureEnv.PRODUCTION]: envSettingsSchema,
  }),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
