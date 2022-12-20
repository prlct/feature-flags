import Joi from 'joi';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService } from 'resources/feature';
import { Env } from 'resources/application';
import { applicationService } from 'resources/application';
import { publicTokenAuth, extractTokenFromQuery } from 'resources/application';
import { userService } from 'resources/user';
import  { amplitudeService } from 'services';
import { calculateABTestsForUser, calculateFlagsForUser, featuresToConfigsForUser } from './helpers';

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  email: Joi.string().trim(),
  userId: Joi.string().trim(),
});

type ValidatedData = {
  env: Env;
  email?: string;
  userId?: string;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { env, email, userId } = ctx.validatedData;

  let user = null;
  if (userId) {
    user = await userService.findOne({ _id: userId });
    if (!user) {
      user = { email };
    }
  }

  if (!application.sdkInstalled) {
    await applicationService.atomic.updateOne({ _id: application._id }, { $set: { sdkInstalled: true } });
    amplitudeService.trackEvent(ctx, 'Install SDK');
    amplitudeService.identifyUser(ctx, 'sdk', true);
  }

  const features = await featureService.getFeaturesForEnv(application._id, env);

  const flagsForUser = await calculateFlagsForUser(features, user);

  const variants = calculateABTestsForUser(userId || user?._id || '', features);

  const configs: { [key: string]: string } = featuresToConfigsForUser(features, variants);

  ctx.body = { features: flagsForUser, configs, variants };
}

export default (router: AppRouter) => {
  router.get(
    '/features',
    extractTokenFromHeader,
    extractTokenFromQuery,
    publicTokenAuth,
    validateMiddleware(schema),
    handler,
  );
};
