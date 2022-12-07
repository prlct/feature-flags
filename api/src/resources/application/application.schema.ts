import Joi from 'joi';
import { Env } from './application.types';

const envDataSchema = Joi.object({
  totalUsersCount: Joi.number().required().default(0),
});

const schema = Joi.object({
  _id: Joi.string().required(),

  companyId: Joi.string().required(),
  publicApiKey: Joi.string().required(),
  privateApiKey: Joi.string().required(),
  featureIds: Joi.array().items(Joi.string()).unique().required().default([]),
  trackEnabled: Joi.boolean(),
  envs: Joi.object({
    [Env.DEVELOPMENT]: envDataSchema,
    [Env.STAGING]: envDataSchema,
    [Env.DEMO]: envDataSchema,
    [Env.PRODUCTION]: envDataSchema,
  }),
  gmailCredentials: Joi.object({
    email: Joi.string().email().required(),
    accessToken: Joi.string().allow(''),
    refreshToken: Joi.string().allow(''),
  }).allow(null),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
