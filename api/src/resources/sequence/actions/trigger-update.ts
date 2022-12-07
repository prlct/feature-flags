import Joi from 'joi';

import sequenceService from '../sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

import sequenceAccess from '../middlewares/sequence-access';

const schema = Joi.object({
  name: Joi.string().required(),
  eventName: Joi.string(),
  eventKey: Joi.string(),
  allowRepeat: Joi.bool().default(false),
  repeatDelay: Joi.number().integer().min(0),
  description: Joi.string(),
});


type ValidatedData = {
  name: string,
  eventKey?: string,
  eventName?: string,
  allowRepeat: boolean,
  repeatDelay: number,
  description: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceId } = ctx.params;
  const trigger = ctx.validatedData;
  console.log(ctx.validatedData);
  ctx.body = await sequenceService.updateOne({ _id: sequenceId }, (seq) => {
    return { ...seq, trigger: { ...seq.trigger, ...trigger } };
  });
};

export default (router: AppRouter) => {
  router.put('/:sequenceId/trigger', sequenceAccess, validateMiddleware(schema), handler);
};
