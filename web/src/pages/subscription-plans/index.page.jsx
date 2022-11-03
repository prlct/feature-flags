import { useState, useCallback } from 'react';
import Head from 'next/head';
import {
  Badge,
  Group,
  SegmentedControl,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { subscriptionApi } from 'resources/subscription';

import PlanItem from './components/plan-item';
import UpgradeModal from './components/upgrade-modal';
import CurrentSubscriptionBlock from './components/current-subscription';

import subscriptionList from './subscription-list';

const SubscriptionPlans = () => {
  const { data: currentSubscription, refetch } = subscriptionApi.useGetCurrent();

  const [interval, setInterval] = useState('year');
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState();

  const renderItems = () => subscriptionList.map((item) => (
    <PlanItem
      key={item.planIds[interval]}
      currentSubscription={currentSubscription}
      interval={interval}
      onPreviewUpgrade={setSelectedUpgradePlan}
      {...item}
    />
  ));

  const onClosePreview = useCallback(() => setSelectedUpgradePlan(undefined), []);

  return (
    <>
      <Head>
        <title>Pricing plans</title>
      </Head>
      <Stack
        align="center"
        sx={{ maxWidth: '1280px', margin: '0 auto' }}
      >
        <Title align="center">Pricing plans</Title>
        <Text size="sm">
          <Badge color="orange" sx={{ marginRight: '8px' }}>Save up to 15%</Badge>
          with yearly subscription
        </Text>
        <Space h={16} />

        <SegmentedControl
          size="md"
          value={interval}
          data={[
            { label: 'Yearly', value: 'year' },
            { label: 'Monthly', value: 'month' },
          ]}
          onChange={setInterval}
        />
      </Stack>

      <Space h={48} />

      <Group
        grow
        component="section"
        position="center"
        sx={{
          maxWidth: '1280px',
          margin: '0 auto',
          alignItems: 'stretch',
        }}
      >
        {renderItems()}
      </Group>

      <Space h={24} />

      <Text align="center" sx={(theme) => ({ color: theme.colors.dark[3] })}>
        You can change your plan or cancel any time
      </Text>

      <Space h={32} />

      <Group
        component="section"
        sx={{ maxWidth: '1280px', margin: '0 auto' }}
      >
        {currentSubscription
          && !currentSubscription.cancelAtPeriodEnd
          && (
          <CurrentSubscriptionBlock
            onCancelSubscription={refetch}
            currentSubscription={currentSubscription}
          />
          )}
      </Group>

      {selectedUpgradePlan && (
        <UpgradeModal
          plan={selectedUpgradePlan}
          interval={interval}
          onClose={onClosePreview}
        />
      )}
    </>
  );
};

export default SubscriptionPlans;
