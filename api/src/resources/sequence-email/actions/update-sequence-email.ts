import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import sequenceEmailAccess from 'resources/sequence-email/middlewares/sequence-email-access';

const schema = Joi.object({
  enabled: Joi.boolean().required(),
  name: Joi.string().required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
  delayDays: Joi.number().integer().required(),
});

type ValidatedData = {
  name: string,
  enabled: boolean,
  subject: string,
  body: string,
  delayDays: number,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceEmailId } = ctx.params;
  const { name, subject, body, delayDays, enabled } = ctx.validatedData;

  ctx.body = await sequenceEmailService.updateOne({
    _id: sequenceEmailId,
  },  (email) => {
    return { ...email, name, enabled, subject, body, delayDays };
  });
};

export default (router: AppRouter) => {
  router.put('/:sequenceEmailId', sequenceEmailAccess, validateMiddleware(schema), handler);
};
