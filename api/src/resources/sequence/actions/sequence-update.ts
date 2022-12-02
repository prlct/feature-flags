import Joi from 'joi';

import sequenceService from '../sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import sequenceAccess from '../middlewares/sequence-access';

const schema = Joi.object({
  name: Joi.string().trim(),
  enabled: Joi.bool(),
  trigger: Joi.object({
    name: Joi.string().required(),
    key: Joi.string().required(),
    eventName: Joi.string(),
    eventKey: Joi.string(),
    allowRepeat: Joi.bool(),
    repeatDelay: Joi.number(),
  }).allow(null).default(null),
});

type ValidatedData = {
  name: string,
  enabled: boolean,
  trigger: {
    name: string,
    description: string | null,
    key: string,
  } | null
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceId } = ctx.params;
  const { name, enabled, trigger } = ctx.validatedData;

  ctx.body = await sequenceService.updateOne({ _id: sequenceId }, (seq) => {
    if (name) {
      seq.name = name;
    }
    if (trigger) {
      seq.trigger = trigger;
    }
    if (enabled) {
      seq.enabled = enabled;
    }

    return seq;
  });
};

export default (router: AppRouter) => {
  router.put('/:sequenceId', sequenceAccess, validateMiddleware(schema), handler);
};
