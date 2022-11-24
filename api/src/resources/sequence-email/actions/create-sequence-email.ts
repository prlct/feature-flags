import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import sequenceEmailService from '../sequence-email.service';

const schema = Joi.object({
  sequenceId: Joi.string().required(),
  name: Joi.string().required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
  delayDays: Joi.number().integer().required(),
});

type ValidatedData = {
  name: string,
  sequenceId: string,
  subject: string,
  body: string,
  delayDays: number,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { applicationId } = ctx.params;
  const { name, sequenceId, subject, body, delayDays } = ctx.validatedData;

  ctx.body = await sequenceEmailService.insertOne({
    applicationId,
    name,
    enabled: false,
    delayDays,
    sequenceId,
    subject,
    body,
  });
};

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
