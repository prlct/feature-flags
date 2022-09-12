import { AppKoaContext, Next } from 'types';
import { featureService } from 'resources/feature';

const featureValidation = async (ctx: AppKoaContext, next: Next) => {
  const { application } = ctx.state;
  const { data: { featureName } } = ctx.request.body;

  if (featureName) {
    const feature = await featureService.findOne({
      applicationId: application._id,
      name: featureName,
    });

    if (!feature) {
      ctx.throwClientError(
        { 'featureName': `Feature with name ${featureName} doesn't exist in the application ${application._id}` }
        , 400,
      );
    }

    ctx.state.feature = feature;
  }
  await next();
};

export default featureValidation;
