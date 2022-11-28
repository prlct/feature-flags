import Joi from 'joi';

import { AppKoaContext, AppRouter } from 'types';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import applicationAccess from 'resources/pipeline/middlewares/application-access';
import { validateMiddleware } from 'middlewares';

const schema = Joi.object({
  applicationId: Joi.string().required(),
  page: Joi.number(),
  limit: Joi.number(),
});

type ValidatedData = {
  applicationId: string,
  page: number,
  limit: number,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { applicationId } = ctx.validatedData;

  ctx.body = await pipelineUserService.find({ applicationId });
};

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), applicationAccess, handler);
};
