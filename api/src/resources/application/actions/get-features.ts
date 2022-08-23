import { AppKoaContext, AppRouter } from 'types';
import { featureService } from 'resources/feature';

async function handler(ctx: AppKoaContext) {
  const { applicationId, env } = ctx.params;
  const features = await featureService.getFeaturesForEnv(applicationId, env);

  ctx.body = features;
}

export default (router: AppRouter) => {
  router.get('/:applicationId/features/:env', handler);
};
