import Joi from 'joi';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

import applicationAccess from 'resources/pipeline/middlewares/application-access';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import pipelineService from 'resources/pipeline/pipeline.service';
import { updatePipelinesForUser } from 'resources/pipeline-user/pipeline-user.helper';


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
  const { applicationId, email, firstName, lastName, pipelines } = ctx.validatedData;

  const user = await pipelineUserService.updateOne({ _id: userId, applicationId }, () => {
    return { email, firstName, lastName };
  });
  ctx.assertError(user, 'User not found');

  const { results: pipelinesArray } = await pipelineService.find({
    applicationId,
    _id: { $in: pipelines.map((p) => p._id) },
    deletedOn: { $exists: false },
  }, {
    projection: { _id: 1, name: 1 },
  });

  await updatePipelinesForUser(user, pipelinesArray);

  ctx.body = await pipelineUserService.findOne({
    _id: userId,
    applicationId,
  });
};

export default (router: AppRouter) => {
  router.put('/:userId', validateMiddleware(schema), applicationAccess, handler);
};
