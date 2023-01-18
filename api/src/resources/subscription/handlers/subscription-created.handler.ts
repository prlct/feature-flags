import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { DATABASE_DOCUMENTS } from 'app.constants';

import { Subscription } from '../subscription.types';
import { companyService } from 'resources/company';

const { SUBSCRIPTIONS } = DATABASE_DOCUMENTS;

eventBus.on(`${SUBSCRIPTIONS}.created`, (data: InMemoryEvent<Subscription>) => {
  const subscription = data.doc;

  companyService.atomic.updateOne(
    { stripeId: subscription.customer },
    {
      $set: { freeLimitUsed: false },    
    },
  );
});
