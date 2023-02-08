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
  allowRedirect: Joi.boolean().default(false),
});

type ValidatedData = {
  name: string,
  enabled: boolean,
  subject: string,
  body: string,
  delayDays: number,
  allowRedirect: boolean,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceEmailId } = ctx.params;
  const { name, subject, body, delayDays, enabled, allowRedirect } = ctx.validatedData;

  ctx.body = await sequenceEmailService.updateOne({
    _id: sequenceEmailId,
  },  () => {
    return { name, enabled, subject, body, delayDays, allowRedirect };
  });
};

export default (router: AppRouter) => {
  router.put('/:sequenceEmailId', sequenceEmailAccess, validateMiddleware(schema), handler);
};
