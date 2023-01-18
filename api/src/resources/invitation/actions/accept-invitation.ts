import moment from 'moment';
import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter, Next } from 'types';
import { invitationService } from 'resources/invitation';
import { adminService } from 'resources/admin';
import { companyService } from 'resources/company';

const schema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'First name is required',
      'string.empty': 'First name is required',
    }),
  lastName: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'Last name is required',
      'string.empty': 'Last name is required',
    }),
});

type ValidatedData = {
  firstName: string;
  lastName: string;
  email: string;
  companyId: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { token } = ctx.params;

  const invitation = await invitationService.findOne({ token, deletedOn: { $exists: false } });

  ctx.assertClientError(invitation, {
    global: 'Invalid invitation link',
  });

  const isTokenExpired = moment().isAfter(invitation.expirationOn);

  ctx.assertClientError(!isTokenExpired, {
    global: 'The invitation link is expired',
  });

  ctx.validatedData.email = invitation.email;
  ctx.validatedData.companyId = invitation.companyId;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { email, companyId, firstName, lastName } = ctx.validatedData;

  const company = await companyService.findOne({ _id: companyId, deletedOn: { $exists: false } });

  // Added because of TS reasons
  ctx.assertClientError(company, {
    global: 'Company does not exists',
  });

  let admin = await adminService.findOne({ email, deletedOn: { $exists: false } });

  if (admin) {
    admin = await adminService.updateOne({ _id: admin._id }, ((doc) => {
      doc.companyIds = [...doc.companyIds, companyId];

      return doc;
    }));
  } else {
    admin = await adminService.insertOne({
      email,
      firstName,
      lastName,
      companyIds: [company._id],
      currentCompany: {
        _id: company._id,
        name: company.name,
      },
      permissions: {
        [company._id]: {
          manageMembers: false,
          managePayments: false,
          manageSenderEmails: false,
        },
      },
      applicationIds: [company.applicationIds[0]],
      isEmailVerified: true,
    });
  }

  const updateCompanyP = companyService.updateOne({ _id: company._id }, (doc) => {
    const adminId = admin?._id as string;
    doc.adminIds = [...doc.adminIds, adminId];

    return doc;
  });

  const removeAdminInvitationsP = invitationService.removeAdminInvitations({ email, companyId });

  await Promise.all([
    updateCompanyP,
    removeAdminInvitationsP,
  ]);

  ctx.body = { email };
}

export default (router: AppRouter) => {
  router.post('/:token', validateMiddleware(schema), validator, handler);
};
