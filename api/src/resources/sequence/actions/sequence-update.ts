import Joi from 'joi';

import sequenceService from '../sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import sequenceAccess from '../middlewares/sequence-access';

const schema = Joi.object({
  name: Joi.string().trim(),
  enabled: Joi.bool(),
});

type ValidatedData = {
  name: string,
  enabled: boolean,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceId } = ctx.params;
  const { name, enabled } = ctx.validatedData;

  ctx.body = await sequenceService.updateOne({ _id: sequenceId }, (seq) => {
    return { ...seq, name, enabled: enabled ?? seq.enabled };
  });
};

export default (router: AppRouter) => {
  router.put('/:sequenceId', sequenceAccess, validateMiddleware(schema), handler);
};
