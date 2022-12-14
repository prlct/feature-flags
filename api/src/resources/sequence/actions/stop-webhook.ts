import Joi from 'joi';

import sequenceService from '../sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { extractTokenFromHeader, validateMiddleware } from 'middlewares';

import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import { extractTokenFromQuery } from 'resources/application';
import publicTokenAuthMiddleware from 'resources/application/middlewares/public-token-auth.middleware';

const schema = Joi.object({
  email: Joi.string().email().required(),
  stopEventKey: Joi.string().required(),
});

type ValidatedData = {
  stopEventKey: string,
  email: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { stopEventKey } = ctx.params;
  const { email } = ctx.validatedData;

  const sequence = await sequenceService.findOne({
    'trigger.stopEventKey': stopEventKey, deletedOn: { $exists: false },
  });

  if (!sequence) {
    ctx.throw(400, 'Sequence not found');
    return;
  }

  await pipelineUserService.atomic.updateOne({
    email,
    'sequence._id': sequence._id,
    deletedOn: { $exists: false },
  }, {
    $set: {
      deletedOn: new Date(),
    },
  });

  ctx.body = 'ok';
};

export default (router: AppRouter) => {
  router.post(
    '/webhook/stop/:stopEventKey',
    extractTokenFromHeader,
    extractTokenFromQuery,
    publicTokenAuthMiddleware,
    validateMiddleware(schema),
    handler,
  );
};
