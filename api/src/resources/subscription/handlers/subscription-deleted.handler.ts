import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { DATABASE_DOCUMENTS } from 'app.constants';

import { Subscription } from '../subscription.types';
import { companyService } from 'resources/company';
import subscriptionService from '../subscription.service';

const { SUBSCRIPTIONS } = DATABASE_DOCUMENTS;

eventBus.on(`${SUBSCRIPTIONS}.deleted`, async (data: InMemoryEvent<Subscription>) => {
  const subscription = data.doc;

  const company = await companyService.findOne({ stripeId: subscription.customer });
  const limits = company && await subscriptionService.getMauUsageLimit(company.applicationIds[0]);

  companyService.atomic.updateOne(
    { stripeId: subscription.customer },
    {
      $set: { freeLimitUsed: limits.limitReached },    
    },
  );
});
