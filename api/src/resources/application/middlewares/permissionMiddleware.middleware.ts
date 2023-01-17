import { AppKoaContext, Next, Permission } from 'types';
import _ from 'lodash';

import applicationService from 'resources/application/application.service';


const permissionsMiddleware = (permissions: Permission[]) => async (ctx: AppKoaContext, next: Next) => {
  const { admin } = ctx.state;

  if (admin.ownCompanyId === admin.currentCompany._id) {
    return next();
  }

  const application = await applicationService.findOne({ companyId: admin.currentCompany._id });
  ctx.assertError(application, 'Application not found');

  const adminCompanyPermissions = _.get(admin, `permissions.${application.companyId}`, []);
  const hasPermissions = _.every(permissions, (permission) => adminCompanyPermissions[permission]);

  if (hasPermissions) {
    return next();
  }

  ctx.throwClientError({ permissions: 'Access Denied' }, 403);
};

export default permissionsMiddleware;
