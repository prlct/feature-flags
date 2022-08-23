import Joi from 'joi';
import { find, filter } from 'lodash';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, FeatureEnv } from 'resources/feature';
import { getFlatFeature } from '../utils/get-flat-feature';

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
  );

  // TODO: Add feature null error
  ctx.body = updatedFeature ? getFlatFeature(updatedFeature, env) : {};
}

export default (router: AppRouter) => {
  router.delete('/:featureId/users', validateMiddleware(schema), handler);
};
