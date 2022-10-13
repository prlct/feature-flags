import { AppKoaContext, AppRouter } from 'types';
import { subscriptionService } from 'resources/subscription';

async function handler(ctx: AppKoaContext) {
  const { admin } = ctx.state;

  if (admin.stripeId) {
    const subscription = await subscriptionService.findOne({ customer: admin.stripeId });
    ctx.body = subscription;

    return;
  }

  ctx.body = null;
}

export default (router: AppRouter) => {
  router.get('/current', handler);
};
