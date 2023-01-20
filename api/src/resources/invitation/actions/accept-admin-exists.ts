import Joi from 'joi';

import { AppKoaContext, AppRouter } from 'types';
import { Invitation, invitationService } from 'resources/invitation';
import { Admin, adminService } from 'resources/admin';
import { Company, companyService } from 'resources/company';
import { validateMiddleware } from 'middlewares';
import config from 'config';

const schema = Joi.object({
  token: Joi.string().required(),
});

const handler = async (ctx: AppKoaContext) => {
  const { token } = ctx.params;

  const invitation = await invitationService.findOne({ token }) as Invitation;

  const admin = await adminService.findOne({ email: invitation.email, deletedOn: { $exists: false } }) as Admin;
  const company = await companyService.findOne({ _id: invitation.companyId }) as Company;

  await adminService.updateOne({ _id: admin._id }, ((doc) => {
    doc.applicationIds = [...doc.applicationIds, company.applicationIds[0]];
    doc.companyIds = [...doc.companyIds, invitation.companyId];
    doc.companies = [...doc.companies, {
      _id: invitation.companyId,
      name: company.name,
    }];
    doc.permissions = { ...doc.permissions, [company._id]: {
      manageMembers: false,
      managePayments: false,
      manageSenderEmails: false,
    } };
    return doc;
  }));

  await companyService.updateOne({ _id: invitation.companyId, deletedOn: { $exists: false } }, (doc) => {
    doc.adminIds = [...doc.adminIds, admin._id];
    return doc;
  });

  ctx.redirect(config.webUrl);
};

export default (router: AppRouter) => {
  router.get('/accept/:token', validateMiddleware(schema), handler);
};
