import Joi from 'joi';
import { find, filter } from 'lodash';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, FeatureEnv, Feature } from 'resources/feature';
import { getFlatFeature } from '../utils/get-flat-feature';
import featureAuth from '../middlewares/feature-auth.middleware';

// TODO: !!! Fix this. undefined when import FeatureEnv or array of FeatureEnv values from resources/feature
const featureEnvValues = ['development', 'staging', 'production'];

const schema = Joi.object({
  env: Joi.string()
    .valid(...featureEnvValues)
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
});

type ValidatedData = {
  env: FeatureEnv;
  email: string;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { featureId } = ctx.params;
  const { env, email } = ctx.validatedData;

  // TODO: Get rid from this request (featureAuth)
  const feature = await featureService.findOne({ _id: featureId });
  const envSettingsUsers = feature?.envSettings[env].users || [];
  const isUserExists = !!find(envSettingsUsers, (user) => (user === email));

  ctx.assertClientError(isUserExists, {
    global: 'User with this email does not exist',
  });

  const newUsersList = filter(envSettingsUsers, (user) => user !== email);

  const updatedFeature = await featureService.updateOne(
    { _id: featureId },
    (doc) => {
      doc.envSettings[env].users = newUsersList;
      return doc;
    },
  ) as Feature;

  ctx.body = getFlatFeature(updatedFeature, env);
}

export default (router: AppRouter) => {
  router.delete('/:featureId/users', featureAuth, validateMiddleware(schema), handler);
};
