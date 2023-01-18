import moment from 'moment';
import { generateId } from '@paralect/node-mongo';

import stripeService from 'services/stripe/stripe.service';
import { Migration } from 'migrator/types';
import { companyService } from 'resources/company';
import { subscriptionService } from 'resources/subscription';

const migration = new Migration(8, 'Add manually created subscriptions');

const companiesToAddSubscription = [
  {
    _id: '63078b286bc29ab70f1b7ddf',
    name: 'Lighthouse',
    email: 'andrew@lighthouse.app',
  },
  {
    _id: '63121a20ec55bfa486a86606',
    name: 'Copysmith',
    email: 'andrei@copysmith.ai',
  },
  {
    _id: '63288812eacc1a1ec402f2e1',
    name: 'Bluebanc',
    email: 'e.chaban@paralect.com',
  },
  {
    _id: '6335af768c6618612eee73ab',
    name: 'Timeshares',
    email: 'andrew+timeshares@paralect.com',
  },
  {
    _id: '635006e4a0a97307752626d8',
    name: 'GoLance',
    email: 'andrew+golance@paralect.com',
  },
  {
    _id: '636a1aae78537ba88eee35ac',
    name: 'Paralect World',
    email: 'a.kukharenko+pworld@paralect.com',
  },
];

migration.migrate = async () => {
  const customers: {
    [key in string]: string
  } = {};

  for (const { email, _id: companyId } of companiesToAddSubscription) {
    const { id: stripeId } = await stripeService.customers.create({ email });
    customers[companyId] = stripeId;
  }

  const updateCompanyList = companiesToAddSubscription.map(({ _id: companyId }) => ({
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

  const addSubscriptionsList = companiesToAddSubscription.map(({ _id: companyId }) => ({
    _id: generateId(),
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
  }));

  await subscriptionService.insertMany(addSubscriptionsList);
};

export default migration;
