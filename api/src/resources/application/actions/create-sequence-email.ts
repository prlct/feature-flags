import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import applicationAuth from '../middlewares/application-auth.middleware';

const schema = Joi.object({
  sequenceId: Joi.string().required(),
  name: Joi.string().required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
  delayDays: Joi.number().integer().required(),
  allowRedirect: Joi.boolean().default(false),
});

type ValidatedData = {
  name: string,
  sequenceId: string,
  subject: string,
  body: string,
  delayDays: number,
  allowRedirect: boolean,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { applicationId } = ctx.params;
  const { name, sequenceId, subject, body, delayDays, allowRedirect } = ctx.validatedData;

  const { results } = await sequenceEmailService.find({
    sequenceId,
    deletedOn: { $exists: false },
  }, { projection: { index: 1 }, sort: { index: -1 }, limit: 1 });

  const index = (results[0]?.index ?? -1) + 1;

  ctx.body = await sequenceEmailService.insertOne({
    applicationId,
    name,
    enabled: false,
    delayDays,
    sequenceId,
    subject,
    body,
    index,
    allowRedirect,
  });
};

export default (router: AppRouter) => {
  router.post('/:applicationId/sequence-emails', applicationAuth, validateMiddleware(schema), handler);
};
