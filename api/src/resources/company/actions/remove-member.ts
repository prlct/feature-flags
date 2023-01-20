import { filter, includes } from 'lodash';

import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService } from 'resources/admin';
import { companyService } from 'resources/company';
import companyAuth from '../middlewares/company-auth.middleware';
import { permissionsMiddleware } from '../../application';


async function validator(ctx: AppKoaContext, next: Next) {
  const { adminId } = ctx.params;
  const { admin } = ctx.state;

  const isRemovingCompanyOwner = admin._id === adminId;

  ctx.assertClientError(!isRemovingCompanyOwner, {
    global: 'Can\'t remove company owner',
  });

  const isAdminExists = await adminService.exists({ _id: adminId });

  ctx.assertClientError(isAdminExists, {
    global: 'Member does not exists',
  });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { companyId, adminId } = ctx.params;

  const company = await companyService.updateOne({ _id: companyId }, (doc) => {
    doc.adminIds = filter(doc.adminIds, (id) => (id !== adminId));

    return doc;
  });

  await adminService.updateOne({ _id: adminId }, (doc) => {
    doc.companyIds = filter(doc.companyIds, (id) => (id !== company?._id));
    doc.companies = filter(doc.companies, ({ _id }) => _id !== company?._id);
    doc.applicationIds = filter(doc.applicationIds, (id) => !includes(company?.applicationIds, id));

    return doc;
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete(
    '/:companyId/members/:adminId',
    companyAuth,
    permissionsMiddleware(['manageMembers']),
    validator,
    handler,
  );
};
