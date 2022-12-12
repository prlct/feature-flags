import Joi from 'joi';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

import applicationAccess from 'resources/pipeline/middlewares/application-access';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';

const schema = Joi.object({
  applicationId: Joi.string().required(),
  userId: Joi.string().required(),
});

type ValidatedData = {
  applicationId: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { userId } = ctx.params;

  ctx.body = await pipelineUserService.deleteSoft({ _id: userId });
};

export default (router: AppRouter) => {
  router.delete('/:userId', validateMiddleware(schema), applicationAccess, handler);
};
