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
import { companyService } from 'resources/company';
import { Admin, adminService } from 'resources/admin';
import sequenceHelper from 'resources/sequence/sequence.helper';
import config from 'config';

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
    amplitudeService.trackEvent(undefined, 'Install SDK');
    const owner = await adminService.findOne({ ownCompanyId: application.companyId }) as Admin;
    sequenceHelper.triggerEvent(
      'sdk-initialized',
      config.mainApplicationId,
      env,
      owner.email,
      owner.firstName || undefined,
      owner.lastName || undefined,
    );
  }

  const company = await companyService.findOne({ applicationIds: application._id });

  if (company?.freeLimitUsed) {
    ctx.body = { features: {}, configs: {}, variants: {} };
    return;
  }

  const features = await featureService.getFeaturesForEnv(application._id, env);



  if (features.length) {
    const enabled = features.filter((f) => f.enabled).length;
    const owner = await adminService.findOne({ ownCompanyId: application.companyId }) as Admin;

    let eventKey = '';
    switch (enabled) {
      case 0:
        break;
      case 2:
        eventKey = 'two-ff-init';
        break;
      case 3:
        eventKey = 'three-ff-init';
        break;
      case 4:
        eventKey = 'four-ff-init';
        break;
      default:
        eventKey = 'feature-flag-initialized';
        break;
    }

    if (eventKey) {
      sequenceHelper.triggerEvent(
        eventKey,
        config.mainApplicationId,
        env,
        owner.email,
        owner.firstName || undefined,
        owner.lastName || undefined,
      );
    }
  }

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
