import { AppKoaContext, AppRouter } from 'types';
import { companyService, Company } from 'resources/company';
import { adminService } from 'resources/admin';
import { invitationService } from 'resources/invitation';

import companyAuth from '../middlewares/company-auth.middleware';


async function handler(ctx: AppKoaContext) {
  const { companyId } = ctx.params;

  const company = await companyService.findOne({ _id: companyId }) as Company;

  const membersP = adminService.aggregate([
    { $match: { _id: { $in: company.adminIds } } },
    { $project: { _id: 1, firstName: 1, lastName: 1, email: 1, createdOn: 1 } },
    { $sort: { createdOn: -1 } },
  ]);

  const invitationsP = invitationService.aggregate([
    { $match: { companyId: company._id, deletedOn: { $exists: false } } },
    { $sort: { createdOn: -1 } },
    {
      $group:
        {
          _id: '$email',
          email: { $first: '$email' },
        },
    },
  ]);

  const [members, invitations] = await Promise.all([membersP, invitationsP]);

  ctx.body = {
    members,
    invitations,
  };
}

export default (router: AppRouter) => {
  router.get('/:companyId/members', companyAuth, handler);
};
