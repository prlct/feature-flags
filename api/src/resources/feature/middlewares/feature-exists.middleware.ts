import { AppKoaContext, Next } from 'types';
import { featureService } from 'resources/feature';

const featureExists = async (ctx: AppKoaContext, next: Next) => {
  const { application } = ctx.state;
  const { featureName } = ctx.params;

  const isFeatureExists = await featureService.exists({
    applicationId: application._id,
    name: featureName,
  });

  if (!isFeatureExists) {
    ctx.status = 404;
    ctx.body = {};
    return null;
  }

  await next();
};

export default featureExists;
