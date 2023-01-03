import Joi from 'joi';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

import applicationAccess from 'resources/pipeline/middlewares/application-access';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import pipelineService from 'resources/pipeline/pipeline.service';


const schema = Joi.object({
  applicationId: Joi.string().required(),
  email: Joi.string().email(),
  firstName: Joi.string().empty(null).allow('').default(''),
  lastName: Joi.string().empty(null).allow('').default(''),
  pipelines: Joi.array().items(Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
  })).empty(null).default([]),
});

type ValidatedData = {
  applicationId: string,
  email: string,
  firstName?:string,
  lastName?: string,
  pipelines: {
    _id: string,
    name: string,
  }[],
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { userId } = ctx.params;
  const { email, firstName, lastName, pipelines } = ctx.validatedData;


  ctx.body = await pipelineUserService.updateOne({
    _id: userId,
  },  (user) => {
    return { ...user, email, firstName, lastName, pipelines };
  });
};

export default (router: AppRouter) => {
  router.put('/:userId', validateMiddleware(schema), applicationAccess, handler);
};
