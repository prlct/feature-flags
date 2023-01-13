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
import dayjs from 'dayjs';
import queryClient from 'query-client';

import { subscriptionApi } from 'resources/subscription';

import PlanItem from './components/plan-item';
import UpgradeModal from './components/upgrade-modal';
import CurrentSubscriptionBlock from './components/current-subscription';

import subscriptionList from './subscription-list';

const SubscriptionPlans = () => {
  const { data: currentSubscription, refetch } = subscriptionApi.useGetCurrent();
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const [interval, setInterval] = useState('year');
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState();

  const matches = useMediaQuery('(max-width: 768px)');

  const endSubscriptionDate = currentSubscription && dayjs(new Date(currentSubscription.endDate * 1000)).format('MMM DD, YYYY');

  const renderItems = (isOwnerCompany) => subscriptionList.map((item) => (
    <PlanItem
      key={item.planIds[interval]}
      currentSubscription={currentSubscription}
      interval={interval}
      onPreviewUpgrade={setSelectedUpgradePlan}
      isOwnerCompany={isOwnerCompany}
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
        align={matches ? 'start' : 'center'}
        sx={{ maxWidth: '1280px', margin: '0 auto' }}
      >
        <Title
          order={matches ? 4 : 1}
          sx={{ paddingTop: matches && 24 }}
        >
          Pricing plans
        </Title>
        <Text size="sm">
          <Badge color="orange" sx={{ marginRight: '8px' }}>Save up to 15%</Badge>
          with yearly subscription
        </Text>
        {!matches && (
          <Space h={16} />
        )}

        <SegmentedControl
          size={matches ? 'sm' : 'md'}
          value={interval}
          data={[
            { label: 'Yearly', value: 'year' },
            { label: 'Monthly', value: 'month' },
          ]}
          onChange={setInterval}
        />
      </Stack>
      {!matches ? (
        <Space h={48} />
      ) : (
        <Space h={16} />
      )}

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

      {currentAdmin?.ownCompanyId && (
        <>
          <Text align="center" sx={(theme) => ({ color: theme.colors.dark[3] })}>
            You can change your plan or cancel any time
          </Text>

          <Space h={32} />

          <Group
            component="section"
            sx={{ maxWidth: '1280px', margin: '0 auto' }}
          >
            {currentSubscription
              && currentSubscription.cancelAtPeriodEnd
              && (
              <Text>
                  {`You current subscription ends ${endSubscriptionDate}.`}
              </Text>
              )}

            {currentSubscription
          && !currentSubscription.cancelAtPeriodEnd
          && (
          <CurrentSubscriptionBlock
            onCancelSubscription={refetch}
            currentSubscription={currentSubscription}
          />
          )}
          </Group>
        </>
      )}

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
