import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { Env } from 'resources/application';
import pipelineService from 'resources/pipeline/pipeline.service';
import applicationAccess from '../middlewares/application-access';

const schema = Joi.object({
  applicationId: Joi.string().required(),
  env: Joi.string().valid(...Object.values(Env)),
});

type ValidatedData = {
  env: Env;
  applicationId: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { env, applicationId } = ctx.validatedData;

  ctx.body = await pipelineService.find({
    env,
    applicationId,
    deletedOn: { $exists: false },
  });
};

export default (router: AppRouter) => {
  router.get(
    '/',
    validateMiddleware(schema),
    applicationAccess,
    handler,
  );
};
