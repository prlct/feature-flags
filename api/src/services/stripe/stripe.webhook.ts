import Stripe from 'stripe';

import { adminService } from 'resources/admin';
import { subscriptionService } from 'resources/subscription';

export default function(event: Stripe.Event) {
  switch (event.type) {
    case 'customer.created':
      adminService.attachStripeCustomerId(event.data.object);
      return;
    case 'customer.subscription.updated':
      subscriptionService.updateSubscription(event.data.object);
      return;
    case 'customer.subscription.deleted':
      subscriptionService.deleteSubscription(event.data.object);
  }
}
