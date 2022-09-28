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

  const subscriptionDetails = await stripe.subscriptions.retrieve(currentSubscription.subscriptionId);

  let items: any;

  if (priceId === '0') {
    items = [];
  } else {
    items = [{
      id: subscriptionDetails.items.data[0].id,
      price: priceId,
    }];
  }

  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: admin.stripeId || undefined,
    subscription: currentSubscription.subscriptionId,
    subscription_items: items,
    subscription_proration_behavior: 'always_invoice',
  });

  ctx.body = { invoice };
}

export default (router: AppRouter) => {
  router.get('/preview-upgrade', validateMiddleware(schema), handler);
};
