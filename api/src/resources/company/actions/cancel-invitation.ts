import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { invitationService } from 'resources/invitation';
import companyAuth from '../middlewares/company-auth.middleware';

const schema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase(),
});

type ValidatedData = {
  email: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;
  const { companyId } = ctx.params;

  const isInvitationExists = await invitationService.exists({ email, companyId, deletedOn: { $exists: false } });
  ctx.assertClientError(isInvitationExists, {
    global: 'Invitation does not exists',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { email } = ctx.validatedData;
  const { companyId } = ctx.params;

  await invitationService.removeAdminInvitations({ email, companyId });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/:companyId/invitations', companyAuth, validateMiddleware(schema), validator, handler);
};
