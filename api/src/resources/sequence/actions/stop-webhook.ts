import Joi from 'joi';

import sequenceService from '../sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { extractTokenFromHeader, validateMiddleware } from 'middlewares';

import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import { Env, extractTokenFromQuery } from 'resources/application';
import privateTokenAuthMiddleware from '../../application/middlewares/private-token-auth.middleware';

const schema = Joi.object({
  email: Joi.string().email().required(),
  env: Joi.string().valid(...Object.values(Env)).required(),
  stopEventKey: Joi.string().required(),
});

type ValidatedData = {
  stopEventKey: string,
  email: string,
  env: Env,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { stopEventKey } = ctx.params;
  const { email, env } = ctx.validatedData;
  const { _id: applicationId } = ctx.state.application;

  const sequence = await sequenceService.findOne({
    applicationId,
    'trigger.stopEventKey': stopEventKey,
    deletedOn: { $exists: false },
    env,
  });

  if (!sequence) {
    ctx.throwClientError({ sequence: 'Sequence not found' });
    return;
  }

  await sequenceService.atomic.updateOne({ _id: sequence._id }, { $inc: { completed: 1 } });

  await pipelineUserService.atomic.updateOne({
    email,
    'sequences._id': sequence._id,
    deletedOn: { $exists: false },
  }, {
    $set: {
      'sequences.$.finishedOn': new Date(),
    },
  });

  ctx.body = 'ok';
};

export default (router: AppRouter) => {
  router.post(
    '/webhook/stop/:stopEventKey',
    extractTokenFromHeader,
    extractTokenFromQuery,
    privateTokenAuthMiddleware,
    validateMiddleware(schema),
    handler,
  );
};
