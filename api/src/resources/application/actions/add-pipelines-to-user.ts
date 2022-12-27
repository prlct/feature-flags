import { AppKoaContext, AppRouter } from 'types';
import Joi from 'joi';
import { validateMiddleware } from 'middlewares';

import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';

import applicationAuth from '../middlewares/application-auth.middleware';

const schema = Joi.object({
  userId: Joi.string().required(),
  pipelinesList: Joi.array().required(),
});

type ValidatedListItem = {
  _id: string,
  applicationId: string,
  createdOn: string,
  updatedOn: string,
  env: string,
  name:string,
};

type ValidatedData = {
  userId: string,
  pipelinesList: ValidatedListItem[],
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { userId, pipelinesList } = ctx.validatedData;
  const { applicationId } = ctx.params;

  const pipelinesArray = pipelinesList.map((pipeline) => ({ _id: pipeline._id, name: pipeline.name }));

  const updateUser = await pipelineUserService.atomic.updateOne(
    { 
      _id: userId,
      applicationId,
    }, 
    { 
      $set: { 
        pipelines: pipelinesArray, 
      }, 
    },
  );

  ctx.body = updateUser;
};


export default (router: AppRouter) => {
  router.post('/:applicationId/pipelines-to-user', applicationAuth, validateMiddleware(schema), handler);
};
