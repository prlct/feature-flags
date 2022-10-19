import Joi from 'joi';
import { Env } from 'resources/application';
import { TargetingRuleOperator } from './feature.types';
import extendedJoi from '../../utils/joi.extension';
import { MAX_REMOTE_CONFIG_LENGTH } from './feature.constants';

const targetingRuleSchema = Joi.object({
  attribute: Joi.string().allow(null, ''),
  operator: Joi.string().valid(...Object.values(TargetingRuleOperator)),
  value: Joi.any()
    .when('type', {
      is: TargetingRuleOperator.EQUALS,
      then: Joi.string().allow(null),
    })
    .when('type', {
      is: TargetingRuleOperator.INCLUDES,
      then: Joi.array().items(Joi.string()),
    }),
});

export const remoteConfigSchema = extendedJoi.json()
  .max(MAX_REMOTE_CONFIG_LENGTH)
  .messages({
    'json.invalid': 'Invalid JSON format',
  });

const envSettingsSchema = Joi.object({
  enabled: Joi.boolean().required().default(false),
  enabledForEveryone: Joi.boolean().required().default(false),
  usersPercentage: Joi.number().min(0).max(100).required().default(0),
  usersViewedCount: Joi.number().required().default(0),
  tests: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      remoteConfig: remoteConfigSchema,
    })).unique().required().default([]),
  targetingRules: Joi.array().items(targetingRuleSchema).default([]),
  visibilityChangedOn: Joi.date(),
  remoteConfig: remoteConfigSchema,
});

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required().allow(''),
  envSettings: Joi.object({
    [Env.DEVELOPMENT]: envSettingsSchema,
    [Env.STAGING]: envSettingsSchema,
    [Env.DEMO]: envSettingsSchema,
    [Env.PRODUCTION]: envSettingsSchema,
  }),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
