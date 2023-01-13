import db from 'db';

import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './subscription.schema';
import { Subscription } from './subscription.types';
import { emailService } from 'services';
import moment from 'moment';
import { companyService } from 'resources/company';
import config from 'config';
import stripe from 'services/stripe/stripe.service';
import { statisticsService } from 'resources/statistics';

const service = db.createService<Subscription>(DATABASE_DOCUMENTS.SUBSCRIPTIONS, { schema });

const updateSubscription = async (data: any) => {
  const subscription = await service.findOne({ subscriptionId: data.id });

  if (subscription && data.cancel_at_period_end && subscription.cancelAtPeriodEnd !== data.cancel_at_period_end) {
    emailService.sendSubscriptionDeleted(data);
  }

  if (subscription?.productId !== data.plan.product) {
    emailService.sendSuccessfulSubscription(data);
  }

  const stripeProduct = await stripe.products.retrieve(data.plan.product);
  const subscriptionLimits = stripeProduct.metadata || {};
  const {
    emails = 0,
    mau = 0,
    pipelines = null,
    users = null,
  } = subscriptionLimits;

  const productName = stripeProduct.name.toLocaleLowerCase() || '';
    
  

  if (subscription?._id) {
    service.updateOne(
      { customer: data.customer },
      () => ({ 
        subscriptionId: data.id,
        planId: data.plan.id,
        productId: data.plan.product,
        status: data.status,
        subscriptionLimits: {
          emails: Number(emails),
          mau: Number(mau),
          pipelines: Number(pipelines) || null,
          users: Number(users) || null,
        },
        name: productName,
        interval: data.plan.interval,
        startDate: data.current_period_start,
        endDate: data.current_period_end,
        cancelAtPeriodEnd: data.cancel_at_period_end,
      }),
    );
    return;
  }

  service.insertOne({
    customer: data.customer,
    subscriptionId: data.id,
    planId: data.plan.id,
    productId: data.plan.product,
    status: data.status,
    subscriptionLimits: {
      emails: Number(emails),
      mau: Number(mau),
      pipelines: Number(pipelines) || null,
      users: Number(users) || null,
    },
    name: productName,
    interval: data.plan.interval,
    startDate: data.current_period_start,
    endDate: data.current_period_end,
    cancelAtPeriodEnd: data.cancel_at_period_end,
  });
};

const deleteSubscription = async (data: any) => {
  service.deleteOne({ subscriptionId: data.id });
};

const getMauUsageLimit = async (applicationId: string) => {

  const company = await companyService.findOne({
    applicationIds: { $elemMatch: { $eq: applicationId } },
    deletedOn: { $exists: false },
  });
  const subscription = company?.stripeId && await service.findOne({ customer: company.stripeId });

  const endDate = new Date;
  const startDate = moment().startOf('month').toDate();

  const monthlyActiveUsersLimit = subscription 
    ? subscription.subscriptionLimits.mau : Number(config.MONTHLY_ACTIVE_USERS_LIMIT);
  const currentPlan = subscription ? subscription.name : 'free';

  const statistics = await statisticsService.aggregate([
    {
      $match: {
        $and: [
          { applicationId },
          { createdOn: { $lte: endDate } },
          { createdOn: { $gte: startDate } },
        ],
      },
    },
    {
      $group: {
        _id: '$applicationId',
        count: { $sum: '$mau' },
      },
    },
  ]);

  return {
    ...statistics[0],
    limitReached: monthlyActiveUsersLimit < (statistics[0]?.count || 0),
    monthlyActiveUsersLimit,
    currentPlan,
  };


};

export default Object.assign(service, {
  updateSubscription,
  deleteSubscription,
  getMauUsageLimit,
});
