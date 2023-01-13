import { AppKoaContext, AppRouter } from 'types';
import { subscriptionService } from 'resources/subscription';

async function handler(ctx: AppKoaContext) {
  const { applicationIds } = ctx.state.admin;

  const statistics = await subscriptionService.getMauUsageLimit(applicationIds[0]);

  let usagePercentage = 0;

  if (statistics?.count) {
    usagePercentage = Math.floor((statistics?.count / statistics?.monthlyActiveUsersLimit) * 100);
  } 

  ctx.body = {
    ...statistics,
    usagePercentage,
  };
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
