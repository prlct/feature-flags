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

  if (admin.stripeId) {
    const invoice = await stripe.invoices.create({
      customer: admin.stripeId, 
      auto_advance: false,
    });

    console.log('invoice', invoice);

    const invoiceItem = await stripe.invoiceItems.create({      
      customer: admin.stripeId,
      price: 'price_1MOMm0CVP8KkfQbnIz6auW4G',
      invoice: invoice.id,
    });

    console.log('invoiceItem', invoiceItem);

    const invoicePay = invoice?.id && await stripe.invoices.pay(invoice?.id);

    console.log('invoicePay', invoicePay);
    ctx.body = { invoicePay };
  }


  

  // const invoice = await stripe.invoices.retrieveUpcoming({
  //   customer: admin.stripeId || undefined,
  //   subscription: currentSubscription.subscriptionId,
  //   subscription_items: items,
  //   subscription_proration_behavior: 'always_invoice',
  // });

  // ctx.body = { };
}

export default (router: AppRouter) => {
  router.post('/additional-package', validateMiddleware(schema), handler);
};