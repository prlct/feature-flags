import Joi from 'joi';

import sequenceService from '../sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import sequenceAccess from '../middlewares/sequence-access';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';

const schema = Joi.object({
  email: Joi.string().email().required(),
  eventKey: Joi.string().required(),
});

type ValidatedData = {
  eventKey: string,
  email: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { eventKey } = ctx.params;

  const sequence = await sequenceService.findOne({ 'trigger.eventKey': eventKey, deletedOn: { $exists: false } });

  if (!sequence) {
    ctx.throw(400, 'Sequence not found');
    return;
  }

  const pipelineUser = await pipelineUserService.findOne({
    'pipeline._id': sequence.pipelineId,
    deletedOn: { $exists: false },
  });

  ctx.body = 'ok';
};

export default (router: AppRouter) => {
  router.put('/webhook/stop/:eventKey', sequenceAccess, validateMiddleware(schema), handler);
};
