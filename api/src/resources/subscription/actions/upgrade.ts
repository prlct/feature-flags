import Joi from 'joi';
import stripe from 'services/stripe/stripe.service';

import { subscriptionService } from 'resources/subscription';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

const schema = Joi.object({
  priceId: Joi.string()
    .required()
    .messages({
      'any.required': 'Price id is required',
      'string.empty': 'Price id is required',
    }),
});

type ValidatedData = {
  priceId: string;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { admin } = ctx.state;
  const { priceId } = ctx.validatedData;

  const currentSubscription = await subscriptionService.findOne({ customer: admin.stripeId || undefined });

  if (!currentSubscription) {
    ctx.status = 400;
    ctx.message = 'Subscription does not exist';

    return;
  }

  if (priceId === '0') {
    await stripe.subscriptions.del(currentSubscription.subscriptionId, {
      prorate: true,
    });

    ctx.body = {};
    return;
  }

  const subscriptionDetails = await stripe.subscriptions.retrieve(currentSubscription.subscriptionId);

  const items = [{
    id: subscriptionDetails.items.data[0].id,
    price: priceId
  }];

  await stripe.subscriptions.update(currentSubscription.subscriptionId, {
    proration_behavior: 'always_invoice',
    cancel_at_period_end: false,
    items,
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/upgrade-subscription', validateMiddleware(schema), handler);
};
