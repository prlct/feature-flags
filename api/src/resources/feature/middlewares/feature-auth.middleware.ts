import { includes } from 'lodash';
import { AppKoaContext, Next } from 'types';
import { featureService } from 'resources/feature';

const featureAuth = async (ctx: AppKoaContext, next: Next) => {
  const { featureId } = ctx.params;
  const feature = await featureService.findOne({ _id: featureId });

  if (!feature) {
    ctx.status = 404;
    ctx.body = {};
    return null;
  }

  const isAdminHasAccessToApplication = includes(ctx.state.admin.applicationIds, feature.applicationId);

  if (isAdminHasAccessToApplication) {
    return next();
  }

  ctx.status = 403;
  ctx.body = {};
  return null;
};

export default featureAuth;
