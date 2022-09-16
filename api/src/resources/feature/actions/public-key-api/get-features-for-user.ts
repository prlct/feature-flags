import Joi from 'joi';
import { includes } from 'lodash';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, FlatFeature } from 'resources/feature';
import { Application, Env } from 'resources/application';
import { publicTokenAuth, extractTokenFromQuery } from 'resources/application';
import { userEventService, UserEventType } from 'resources/user-event';
import { userService, User } from 'resources/user';

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

const calculateFlagForUser = async (  
  feature: FlatFeature, 
  application: Application,
  user: User | null,
): Promise<boolean> => {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _id,
    env,
    enabled,
    enabledForEveryone, 
    users, 
    usersPercentage,
    visibilityChangedOn, 
    usersViewedCount, 
  } = feature;

  if (!enabled) {
    return false;
  }

  if (enabledForEveryone) {
    return true;
  }

  if (user?.email) {
    const isFeatureEnabledForUser = includes(users, user?.email);

    if (isFeatureEnabledForUser) {
      return true;
    }

    const { trackEnabled } = application;
    if (usersPercentage > 0 && trackEnabled) {
      const { totalUsersCount } = application.envs[env];
     
      // this shouldn't happen, just to avoid division by 0
      if (totalUsersCount === 0) {
        return false;
      }

      const viewedPercent = usersViewedCount / totalUsersCount * 100;
      if (viewedPercent < usersPercentage) {
        return true;
      }

      const userViewedCount = await userEventService.countDocuments({ 
        userId: user?._id, 
        type: UserEventType.FeatureViewed,
        'data.featureId': _id,
        createdOn: { $gt: visibilityChangedOn }, 
      });

      if (userViewedCount > 0) {
        return true;
      }
    } 
  }

  return false;
};

export const calculateFlagsForUser = async (
  features: FlatFeature[], 
  application: Application,
  user: User | null,
) => {
  const flags: { [key: string]: boolean } = {};
  for (const feature of features) {
    const { name } = feature;

    flags[name] = await calculateFlagForUser(feature, application, user);
  }

  return flags;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { env, email } = ctx.validatedData;

  let user = null;
  if (email) {
    user = await userService.findOne({ email, applicationId: application._id, env });
  }
  const features = await featureService.getFeaturesForEnv(application._id, env);
  
  const flagsForUser = await calculateFlagsForUser(features, application, user);
 
  const configs: { [key: string]: boolean } = {};

  ctx.body = { features: flagsForUser, configs };
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
