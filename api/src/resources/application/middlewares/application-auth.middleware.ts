import { includes } from 'lodash';
import { AppKoaContext, Next } from 'types';

const applicationAuth = (ctx: AppKoaContext, next: Next) => {
  const { applicationId } = ctx.params;
  const isAdminHasAccessToApplication = includes(ctx.state.admin.applicationIds, applicationId);

  if (isAdminHasAccessToApplication) {
    return next();
  }

  ctx.status = 403;
  ctx.body = {};
  return null;
};

export default applicationAuth;
