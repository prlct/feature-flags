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

  const updateCompanyList = companyIds.map((companyId: string) => ({
    updateOne: {
      filter: {
        _id: companyId,
      },
      update: {
        $set: {
          stripeId: customers[companyId],
        },
      },
    },
  }));

  await companyService.atomic.bulkWrite(updateCompanyList);

  const addSubscriptionsList = companyIds.map((companyId: string) => ({
    insertOne: { 
      companyId: companyId,
      customer: customers[companyId],
      subscriptionId: 'pro-manual',
      planId: 'price_1LnMIOKu55YRO0mahVfG4UKl',
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
    }, 
  }));

  await subscriptionService.atomic.bulkWrite(addSubscriptionsList);
};

export default migration;
