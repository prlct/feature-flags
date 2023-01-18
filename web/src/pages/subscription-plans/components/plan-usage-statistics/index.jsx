import { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import {
  Text,
  Stack,
  Title,
  Group,
  Progress,
  Space,
} from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { statisticsApi } from 'resources/statistics';
import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';
import queryClient from 'query-client';

import { companyApi } from 'resources/company';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';
import subscriptionList from '../../subscription-list';

import { useStyles } from './styles';

const PlanUsageStatistics = ({
  subscriptionName,
  planId = '0',
  interval,
  nextPayment,
  subscriptionLimits,
  cancelAtPeriodEnd,
}) => {
  const admin = queryClient.getQueryData(['currentAdmin']);
  const companyId = admin.companyIds[0];

  const matches = useMediaQuery('(max-width: 768px)');
  const { classes } = useStyles(matches);

  const {
    data: mauStatistics,
    isLoading: isMauLoading } = statisticsApi.useGetStatistics();
  const {
    data: emailsStatistics,
    isLoading: isEmailsLoading,
  } = statisticsApi.useGetEmailStatistics({ companyId });
  const {
    data: members,
    isLoading: isUsersLoading,
  } = companyApi.useGetMembers();

  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });
  const {
    data,
  } = emailSequencesApi.useGetPipelines(env);

  const isLoaderVisible = isMauLoading || isEmailsLoading || isUsersLoading;

  const pipelines = useMemo(() => data?.results || [], [data]);

  const currentSubscription = subscriptionList.find((item) => item.planIds[interval] === planId);

  const membersList = useMemo(() => {
    if (!members) {
      return [];
    }

    const list = [
      ...cloneDeep(members.members),
      ...cloneDeep(members.invitations).map((m) => ({ ...m, isInvitation: true })),
    ];

    return list;
  }, [members]);

  const endSubscriptionDate = useMemo(
    () => dayjs(new Date(nextPayment * 1000)).format('DD MMM YYYY'),
    [nextPayment],
  );

  if (isLoaderVisible) return null;

  return (
    <>
      <Stack spacing={7}>
        <Title
          order={matches ? 4 : 3}
          sx={{ paddingTop: !matches && 16, paddingBottom: matches ? 8 : 16 }}
        >
          Your plan
        </Title>
        <Text className={classes.planDescription} size="lg">
          Plan
          {' '}
          <b>{subscriptionName || 'Basic'}</b>
        </Text>
        <Text size="lg" className={classes.planDescription}>
          Monthly cost
          {' '}
          <b>
            {currentSubscription?.price[interval] ? `$${currentSubscription?.price[interval]}` : 'Free'}
          </b>
        </Text>

        {cancelAtPeriodEnd ? (
          <Text size="lg" className={classes.planDescription}>
            You canceled your
            {' '}
            <b>{subscriptionName}</b>
            {' '}
            plan. Subscription will be ended on
            {' '}
            {currentSubscription?.price[interval]
              ? endSubscriptionDate : '-'}
          </Text>
        ) : (
          <Text size="lg" className={classes.planDescription}>
            Next payment on
            {' '}
            {currentSubscription?.price[interval]
              ? endSubscriptionDate : '-'}
          </Text>
        )}

      </Stack>

      <Space h={24} />
      <Group pb={40}>
        <Stack className={classes.limitBox}>
          <Text size="lg" className={classes.limitBoxTitle}>
            Daily emails
          </Text>
          <Progress
            size="sm"
            value={emailsStatistics?.usagePercentage}
            color={emailsStatistics?.usagePercentage >= 95 && 'red'}
            className={classes.progressBar}
          />
          <Group position="apart" width="100%" sx={{ height: 20 }}>
            <Text
              size="sm"
              className={classes.progressValue}
            >
              {emailsStatistics?.sendingEmailsToday || 0}
            </Text>
            <Text
              size="sm"
              className={classes.progressValue}
            >
              {emailsStatistics?.dailyEmailsLimit.toLocaleString('en')}
            </Text>
          </Group>
        </Stack>
        <Stack className={classes.limitBox}>
          <Text size="lg" className={classes.limitBoxTitle}>
            MAU
          </Text>
          <Progress
            size="sm"
            value={mauStatistics?.usagePercentage}
            color={mauStatistics?.usagePercentage >= 95 && 'red'}
            className={classes.progressBar}
          />
          <Group position="apart" width="100%">
            <Text size="sm">{mauStatistics?.count.toLocaleString('en')}</Text>
            <Text size="sm">{mauStatistics?.monthlyActiveUsersLimit.toLocaleString('en')}</Text>
          </Group>
        </Stack>
        <Stack className={classes.limitBox}>
          <Text size="lg" className={classes.limitBoxTitle}>
            Pipelines
          </Text>
          <Progress
            size="sm"
            value={subscriptionLimits?.pipelines
              ? Math.floor((pipelines.length / (subscriptionLimits?.pipelines || 1)) * 100) : 0}
            className={classes.progressBar}
          />
          <Group position="apart" width="100%">
            <Text size="sm">{pipelines.length.toLocaleString('en')}</Text>
            <Text size="sm">{subscriptionLimits?.pipelines || 'Unlimited'}</Text>
          </Group>
        </Stack>
        <Stack className={classes.limitBox}>
          <Text size="lg" className={classes.limitBoxTitle}>
            Product users
          </Text>
          <Progress
            size="sm"
            value={subscriptionLimits?.users
              ? Math.floor((membersList.length / (subscriptionLimits?.users || 1)) * 100) : 0}
            className={classes.progressBar}
          />
          <Group position="apart" width="100%">
            <Text size="sm">{membersList.length.toLocaleString('en')}</Text>
            <Text size="sm">{subscriptionLimits?.users || 'Unlimited'}</Text>
          </Group>
        </Stack>
      </Group>
    </>
  );
};

PlanUsageStatistics.propTypes = {
  subscriptionName: PropTypes.string,
  planId: PropTypes.string,
  nextPayment: PropTypes.number,
  interval: PropTypes.oneOf(['month', 'year']),
  subscriptionLimits: PropTypes.shape({
    emails: PropTypes.number.isRequired,
    mau: PropTypes.number.isRequired,
    pipelines: PropTypes.number.isRequired,
    users: PropTypes.number.isRequired,
  }).isRequired,
  cancelAtPeriodEnd: PropTypes.bool,
};

PlanUsageStatistics.defaultProps = {
  subscriptionName: '',
  planId: '',
  nextPayment: 0,
  interval: 'month',
  cancelAtPeriodEnd: false,
};

export default memo(PlanUsageStatistics);
