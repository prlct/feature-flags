import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import sequenceAccess from '../../sequence/middlewares/sequence-access';

const schema = Joi.object({
  sequenceId: Joi.string().trim().required(),
});

type ValidatedData = {
  sequenceId: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceId } = ctx.validatedData;

  ctx.body = await sequenceEmailService.find({ sequenceId, deletedOn: { $exists: false } });
};

export default (router: AppRouter) => {
  router.get('/', sequenceAccess, validateMiddleware(schema), handler);
};
