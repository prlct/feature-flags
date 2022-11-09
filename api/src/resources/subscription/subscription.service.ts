import db from 'db';

import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './subscription.schema';
import { Subscription } from './subscription.types';
import { emailService } from 'services';

const service = db.createService<Subscription>(DATABASE_DOCUMENTS.SUBSCRIPTIONS, { schema });

const updateSubscription = async (data: any) => {
  const subscription = await service.findOne({ subscriptionId: data.id });

  if (subscription && data.cancel_at_period_end && subscription.cancelAtPeriodEnd !== data.cancel_at_period_end) {
    emailService.sendSubscriptionDeleted(data);
  }

  service.atomic.updateOne(
    { customer: data.customer },
    {
      $set: {
        subscriptionId: data.id,
        planId: data.plan.id,
        productId: data.plan.product,
        status: data.status,
        interval: data.plan.interval,
        startDate: data.current_period_start,
        endDate: data.current_period_end,
        cancelAtPeriodEnd: data.cancel_at_period_end,
      },
    },
    {
      upsert: true,
    },
  );
};

const deleteSubscription = async (data: any) => {
  service.atomic.deleteOne({ subscriptionId: data.id });
};

export default Object.assign(service, {
  updateSubscription,
  deleteSubscription,
});
