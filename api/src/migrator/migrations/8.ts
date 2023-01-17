import { promiseUtil } from 'utils';
import { Migration } from 'migrator/types';
import { companyService } from 'resources/company';
import moment from 'moment';
import { subscriptionService } from 'resources/subscription';

const migration = new Migration(8, 'Add manually created subscriptions');

migration.migrate = async () => {
  const companyIds = await companyService.distinct('_id', { stripeId: { $exists: false } }  );

  const customers = companyIds.reduce((acc: any, item: string) => ({
    ...acc, [item]: (Math.random() + 1).toString(36).substring(7), 
  }), {});

  const updateFn = (companyId: string) => companyService.atomic.updateOne(
    { _id: companyId },
    { $set: { stripeId: customers[companyId] } },
  );

  await promiseUtil.promiseLimit(companyIds, 50, updateFn);

  const addSubscription = (companyId: string) => subscriptionService.atomic.insertOne({
    companyId: companyId,
    customer: customers[companyId],
    subscriptionId: 'pro-manual',
    planId: 'price_',
    productId: 'prod_',
    status: 'active',
    subscriptionLimits: {
      emails: 60000,
      mau: 100000,
      pipelines: null,
      users: null,
    },
    name: 'pro',
    interval: 'year',
    startDate: Number(moment().format('x')),
    endDate: Number(moment().add(1, 'y').format('x')),
    cancelAtPeriodEnd: true,
  });

  await promiseUtil.promiseLimit(companyIds, 50, addSubscription);
};

export default migration;
