import { AppKoaContext, AppRouter } from 'types';
import { featureService } from 'resources/feature';

import featureAuth from '../middlewares/feature-auth.middleware';

async function handler(ctx: AppKoaContext) {
  const { featureId } = ctx.params;
  
  await featureService.deleteSoft({ _id: featureId });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/:featureId', featureAuth,  handler);
};
