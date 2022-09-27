import { useState, useCallback } from 'react';
import Head from 'next/head';
import {
  Button,
  Group,
  Text,
  Space,
} from '@mantine/core';

import { subscriptionApi } from 'resources/subscription';

import PlanItem from './components/plan-item';
import UpgradeModal from './components/upgrade-modal';
import CurrentSubscriptionBlock from './components/current-subscription';

import subscriptionList from './subscription-list';

const SubscriptionPlans = () => {
  const { data: currentSubscription } = subscriptionApi.useGetCurrent();

  const [interval, setInterval] = useState('year');
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState();

  const renderItems = useCallback(() =>
    subscriptionList.map((item) => 
      <PlanItem
        key={item.planIds[interval]}
        currentSubscription={currentSubscription}
        interval={interval}
        onPrevewUpgrade={setSelectedUpgradePlan}
        {...item}
      />
    ), [
      interval,
      currentSubscription
    ]);

  const onClosePreview = useCallback(() => setSelectedUpgradePlan(undefined), []);

  return (
    <>
      <Head>
        <title>Pricing plans</title>
      </Head>
      <Group
        sx={{ maxWidth: '1280px', margin: '0 auto' }}
      >
        <Text size="lg" sx={{ flex: '1 1 100%' }} align="center">You can change your plan or cancel any time.</Text>

        <Button variant={interval === 'year' ? 'light' : 'subtle'} onClick={() => setInterval('year')}>Pay Yearly</Button>
        <Button variant={interval === 'month' ? 'light' : 'subtle'} onClick={() => setInterval('month')}>Pay Monthly</Button>

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

      <Space h={32} />

      <Group
        sx={{ maxWidth: '1280px', margin: '0 auto' }}
      >
        <CurrentSubscriptionBlock />
      </Group>

      {selectedUpgradePlan && (
        <UpgradeModal
          priceId={selectedUpgradePlan}
          interval={interval}
          onClose={onClosePreview}
        />
      )}
    </>
  );
};

export default SubscriptionPlans;
