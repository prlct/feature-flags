import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { featureService } from 'resources/feature';
import { applicationService, Env } from 'resources/application';
import applicationAuth from '../middlewares/application-auth.middleware';
import pipelineUserService from '../../pipeline-user/pipeline-user.service';

const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 300;

const schema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .max(NAME_MAX_LENGTH)
    .regex(/^[A-Za-z0-9_\-]*$/)
    .messages({
      'any.required': 'Feature name is required',
      'string.empty': 'Feature name is required',
    }),
  description: Joi.string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH)
    .allow(''),
});

type ValidatedData = {
  name: string;
  description: string;
  applicationId: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { name } = ctx.validatedData;
  const { applicationId } = ctx.params;

  const feature = await featureService.exists({ name, applicationId });
  ctx.assertClientError(!feature, {
    name: 'Feature flag with the same name already exists',
  });

  ctx.validatedData.applicationId = applicationId;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    name,
    description,
    applicationId,
  } = ctx.validatedData;

  const featureEnvSettings = {
    enabled: false,
    enabledForEveryone: true,
    usersPercentage: 0,
    usersViewedCount: 0,
    tests: [],
    remoteConfig: '',
  };

  const feature = await featureService.insertOne({
    name,
    description,
    applicationId,
    envSettings: {
      [Env.DEVELOPMENT]: featureEnvSettings,
      [Env.STAGING]: featureEnvSettings,
      [Env.DEMO]: featureEnvSettings,
      [Env.PRODUCTION]: featureEnvSettings,
    },
  });

  await applicationService.updateOne(
    { _id: applicationId },
    (doc) => ({ featureIds: [...doc.featureIds, feature._id] }),
  );

  const count = await featureService.countDocuments({}, { requireDeletedOn: true });

  ctx.body = { isFirst: count === 1 };
}

export default (router: AppRouter) => {
  router.post('/:applicationId/features', applicationAuth, validateMiddleware(schema), validator, handler);
};
