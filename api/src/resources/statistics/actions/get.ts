import config from 'config';

import moment from 'moment';

import { AppKoaContext, AppRouter } from 'types';
import { statisticsService } from 'resources/statistics';
import { subscriptionService } from 'resources/subscription';

import stripe from 'services/stripe/stripe.service';

async function handler(ctx: AppKoaContext) {
  const { admin } = ctx.state;

  const endDate = moment().subtract(2, 'weeks').toDate();
  const startDate = moment(endDate).startOf('month').toDate();

  let monthlyActiveUsersLimit = config.MONTHLY_ACTIVE_USERS_LIMIT;

  if (admin.stripeId) {
    const subscription = await subscriptionService.findOne({ customer: admin.stripeId });

    if (subscription) {
      const stripeProduct = await stripe.products.retrieve(subscription?.productId);

      monthlyActiveUsersLimit = Number(stripeProduct.metadata.mau) || config.MONTHLY_ACTIVE_USERS_LIMIT;
    }
  }

  const statistics = await statisticsService.aggregate([
    {
      $match: {
        $and: [
          { applicationId: { $in: admin.applicationIds } },
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

  ctx.body = {
    ...statistics[0],
    limitReached: monthlyActiveUsersLimit < (statistics[0]?.mau || 0),
  };
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
