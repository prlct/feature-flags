import Head from 'next/head';
import {
  Group,
} from '@mantine/core';

import PlanItem from './components/plan-item';

import subscriptionList from './subscription-list';

const SubscriptionPlans = () => {
  const renderItems = () => subscriptionList.map((item) => <PlanItem key={item.id} {...item} />);

  return (
    <>
      <Head>
        <title>Pricing</title>
      </Head>
        <Group
          grow
          position="center"
          sx={{ maxWidth: '1280px', margin: '0 auto' }}
        >
          {renderItems()}
        </Group>
    </>
  );
};

export default SubscriptionPlans;
