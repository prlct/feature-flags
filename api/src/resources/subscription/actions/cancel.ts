import stripe from 'services/stripe/stripe.service';

import { subscriptionService } from 'resources/subscription';

import { AppKoaContext, AppRouter } from 'types';
import { companyService } from 'resources/company';
import { permissionsMiddleware } from '../../application';

async function handler(ctx: AppKoaContext) {
  const { admin } = ctx.state;

  const company = await companyService.findOne({ _id: admin.currentCompany._id });

  const currentSubscription = company && await subscriptionService.findOne({ companyId: company._id || undefined });

  if (!currentSubscription) {
    ctx.status = 400;
    ctx.message = 'Subscription does not exist';

    return;
  }

  await stripe.subscriptions.update(currentSubscription.subscriptionId, {
    cancel_at_period_end: true,
  });

  ctx.body = currentSubscription;
}

export default (router: AppRouter) => {
  router.post('/cancel-subscription', permissionsMiddleware(['managePayments']), handler);
};
