import Joi from 'joi';
import config from 'config';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService } from 'resources/admin';
import { invitationService } from 'resources/invitation';
import { emailService } from 'services';
import companyAuth from '../middlewares/company-auth.middleware';

const schema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
});

type ValidatedData = {
  email: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const isAdminExists = await adminService.exists({ email });
  ctx.assertClientError(!isAdminExists, {
    email: 'User already has a company',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { companyId } = ctx.params;
  const { admin } = ctx.state;
  const { email } = ctx.validatedData;

  const invitation = await invitationService.createCompanyMemberInvitation({ companyId, email, adminId: admin._id });
  try {
    await emailService.sentCompanyInvitation(
      email,
      {
        fullName: `${admin.firstName} ${admin.lastName}`,
        acceptInvitationLink: `${config.webUrl}/accept-invitation/?token=${invitation.token}`,
      },
    );
  } catch (error) {
    console.log('Send email error', error);
    ctx.assertClientError(false, {
      global: 'Failed to send invitation email',
    });
  }


  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/:companyId/invitations', companyAuth, validateMiddleware(schema), validator, handler);
};
