import config from 'config';
import Joi from 'joi';
import stripe from 'services/stripe/stripe.service';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

const schema = Joi.object({
  priceId: Joi.string()
    .required()
    .messages({
      'any.required': 'Price id is required',
      'string.empty': 'Price id is required',
    }),
  interval: Joi.string()
    .allow('month', 'year')
    .default('month')
    .messages({

    }),
});

type ValidatedData = {
  priceId: string;
  interval: string;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { admin } = ctx.state;
  const { priceId, interval } = ctx.validatedData;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: admin.stripeId || undefined,
    customer_email: !admin.stripeId ? admin.email : undefined,
    line_items: [{
      quantity: 1,
      price: priceId,
    }],
    success_url: `${config.webUrl}?subscriptionPlan=${priceId}&interval=${interval}`,
    cancel_url: config.webUrl,
  });

  if (!session.url) {
    ctx.status = 503;

    return null;
  }

  ctx.body = { checkoutLink: session.url };
}

export default (router: AppRouter) => {
  router.post('/subscribe', validateMiddleware(schema), handler);
};
