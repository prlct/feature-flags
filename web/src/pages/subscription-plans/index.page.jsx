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
import { useMediaQuery } from '@mantine/hooks';
import queryClient from 'query-client';

import { subscriptionApi } from 'resources/subscription';

import PlanItem from './components/plan-item';
import UpgradeModal from './components/upgrade-modal';

import subscriptionList from './subscription-list';
import PlanUsageStatistics from './components/plan-usage-statistics';

const SubscriptionPlans = () => {
  const { data: currentSubscription, refetch } = subscriptionApi.useGetCurrent();
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const [interval, setInterval] = useState('year');
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState();

  const matches = useMediaQuery('(max-width: 768px)');

  const renderItems = (isOwnerCompany) => subscriptionList.map((item) => (
    <PlanItem
      key={item.planIds[interval]}
      currentSubscription={currentSubscription}
      interval={interval}
      onPreviewUpgrade={setSelectedUpgradePlan}
      isOwnerCompany={isOwnerCompany}
      onCancelSubscription={refetch}
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
        align="start"
        sx={{ maxWidth: '1280px', margin: '0 auto' }}
      >
        <Title
          order={matches ? 4 : 3}
          sx={{ paddingTop: matches && 24 }}
        >
          Pricing plans
        </Title>
        <Group spacing={24}>
          <SegmentedControl
            size={matches ? 'sm' : 'md'}
            value={interval}
            data={[
              { label: 'Yearly', value: 'year' },
              { label: 'Monthly', value: 'month' },
            ]}
            onChange={setInterval}
          />
          <Text size="sm">
            <Badge color="orange" sx={{ marginRight: '8px' }}>Save up to 15%</Badge>
            with yearly subscription
          </Text>
        </Group>

      </Stack>
      <Space h={16} />

      <Group
        grow={!matches && true}
        component="section"
        position="center"
        sx={{
          maxWidth: '1280px',
          margin: '0 auto',
          alignItems: 'stretch',
          '@media (max-width: 768px)': {
            flexDirection: 'column',
          },
        }}
      >
        {renderItems(!!currentAdmin?.ownCompanyId)}
      </Group>

      <Space h={24} />

      <PlanUsageStatistics
        subscriptionName={currentSubscription?.name}
        planId={currentSubscription?.planId}
        interval={interval}
        nextPayment={currentSubscription?.endDate}
        subscriptionLimits={currentSubscription?.subscriptionLimits}
        cancelAtPeriodEnd={currentSubscription?.cancelAtPeriodEnd}
      />

      {currentAdmin?.ownCompanyId && selectedUpgradePlan && (
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
