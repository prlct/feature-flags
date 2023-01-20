import { AppKoaContext, AppRouter } from 'types';
import { subscriptionService } from 'resources/subscription';

async function handler(ctx: AppKoaContext) {
  const { currentApplicationId } = ctx.state.admin;

  const statistics = await subscriptionService.getMauUsageLimit(currentApplicationId);

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
