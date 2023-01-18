import Joi from 'joi';
import config from 'config';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService } from 'resources/admin';
import { invitationService } from 'resources/invitation';
import { emailService } from 'services';
import companyAuth from '../middlewares/company-auth.middleware';
import companyService from '../company.service';
import { subscriptionService } from 'resources/subscription';
import { permissionsMiddleware } from '../../application';

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

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { companyId } = ctx.params;
  const { admin } = ctx.state;
  const { email } = ctx.validatedData;
  const [applicationId] = admin.applicationIds;

  let usersLimit = config.USERS_LIMIT;

  const company = await companyService.findOne({ applicationIds: applicationId });
  const subscription = company && await subscriptionService.findOne({ companyId: company._id });

  if (subscription) {
    usersLimit = subscription.subscriptionLimits.users || 0;
  }

  if (company && usersLimit) {
    const { results: invitationsList } = await invitationService.find({ companyId: company._id });
    const isMembersLength = (company?.adminIds?.length + invitationsList.length) >= usersLimit;

    ctx.assertClientError(!isMembersLength, {
      global: 'Members limit exceeded',
    });
  }

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
  router.post(
    '/:companyId/invitations',
    companyAuth,
    permissionsMiddleware(['manageMembers']),
    validateMiddleware(schema),
    handler,
  );
};
