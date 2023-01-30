import { AppKoaContext, AppRouter } from 'types';
import Joi from 'joi';
import { validateMiddleware } from 'middlewares';

import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import pipelineService from 'resources/pipeline/pipeline.service';

import applicationAuth from '../middlewares/application-auth.middleware';
import sequenceService from '../../sequence/sequence.service';

const schema = Joi.object({
  userId: Joi.string().required(),
  pipelineIds: Joi.array().items(Joi.string().trim()).required(),
});

type ValidatedData = {
  userId: string,
  pipelineIds: string[],
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { userId, pipelineIds } = ctx.validatedData;
  const { applicationId } = ctx.params;

  const { results: pipelinesArray } = await pipelineService.find({
    applicationId,
    _id: { $in: pipelineIds },
    deletedOn: { $exists: false },
  }, {
    projection: { _id: 1, name: 1 },
  });

  ctx.body = await pipelineUserService.updateOne(
    {
      _id: userId,
      applicationId,
    },
    (user) => {
      user.pipelines = pipelinesArray;
      return user;
    },
  );
};


export default (router: AppRouter) => {
  router.post('/:applicationId/pipelines-to-user', applicationAuth, validateMiddleware(schema), handler);
};
