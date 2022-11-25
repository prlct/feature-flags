import { includes } from 'lodash';
import { AppKoaContext, Next } from 'types';

type ValidatedData = {
  applicationId: string,
};

const applicationAuth = (ctx: AppKoaContext<ValidatedData>, next: Next) => {
  const { applicationId } = ctx.validatedData;
  const isAdminHasAccessToApplication = includes(ctx.state.admin.applicationIds, applicationId);

  if (isAdminHasAccessToApplication) {
    return next();
  }

  ctx.status = 403;
  ctx.body = {};
  return null;
};

export default applicationAuth;
