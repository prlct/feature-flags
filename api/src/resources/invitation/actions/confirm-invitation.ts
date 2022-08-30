import moment from 'moment';

import { AppKoaContext, AppRouter, Next } from 'types';
import { invitationService } from 'resources/invitation';
import { adminService } from 'resources/admin';
import { companyService } from 'resources/company';

type ValidatedData = {
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

  const isAdminExists = await adminService.exists({ email: invitation.email });
  ctx.assertClientError(!isAdminExists, {
    global: 'You already have an account',
  });

  ctx.validatedData = {
    email: invitation.email,
    companyId: invitation.companyId,
  };

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { email, companyId } = ctx.validatedData;

  const company = await companyService.findOne({ _id: companyId });

  // Added because of TS reasons
  ctx.assertClientError(company, {
    global: 'Company does not exists',
  });

  const admin = await adminService.insertOne({
    email,
    // TODO: fix !!!
    // firstName,
    // lastName,
    companyIds: [company._id],
    applicationIds: [company.applicationIds[0]],
    isEmailVerified: true,
  });

  const updateCompanyP = companyService.updateOne({ _id: company._id }, (doc) => {
    doc.adminIds = [...doc.adminIds, admin._id];
    
    return doc;
  });

  const removeAdminInvitationsP = invitationService.removeAdminInvitations(email);

  await Promise.all([
    updateCompanyP,
    removeAdminInvitationsP,
  ]);

  ctx.body = { email };
}

export default (router: AppRouter) => {
  router.post('/:token', validator, handler);
};
