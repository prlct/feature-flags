import { useState, useCallback } from 'react';
import Head from 'next/head';
import {
  Button,
  Group,
  Text,
  Space,
} from '@mantine/core';

import PlanItem from './components/plan-item';

import subscriptionList from './subscription-list';

const SubscriptionPlans = () => {

  const [period, setPeriod] = useState('year');

  const renderItems = useCallback(() =>
    subscriptionList.map((item) => <PlanItem key={item.planIds[period]} period={period} {...item} />),
    [subscriptionList, period]
  );

  return (
    <>
      <Head>
        <title>Pricing</title>
      </Head>
      <Group
        sx={{ maxWidth: '1280px', margin: '0 auto' }}
      >
        <Text size="lg" sx={{ flex: '1 1 100%' }} align="center">You can change your plan or cancel any time.</Text>

        <Button variant={period === 'year' ? 'light' : 'subtle'} onClick={() => setPeriod('year')}>Pay Yearly</Button>
        <Button variant={period === 'month' ? 'light' : 'subtle'} onClick={() => setPeriod('month')}>Pay Monthly</Button>

        <Text size="sm" sx={{ flex: '1 1 100%' }}>Save up to <b>15%</b> with yearly subscription</Text>
      </Group>
      <Space h={32} />
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
