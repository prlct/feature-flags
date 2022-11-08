import { useCallback, memo } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import {
  Button,
  Text,
  Stack,
} from '@mantine/core';

import { subscriptionApi } from 'resources/subscription';
import { useAmplitude } from 'contexts/amplitude-context';
import subscriptionList from '../../subscription-list';

const CurrentSubscriptionBlock = ({ onCancelSubscription, currentSubscription }) => {
  const cancelMutation = subscriptionApi.useCancelMutation();
  const amplitude = useAmplitude();

  const onCancelCurrentSubscription = useCallback(() => {
    cancelMutation.mutate(null, {
      onSuccess: () => {
        const plan = subscriptionList.find(
          (item) => item.planIds[currentSubscription.interval] === currentSubscription.planId,
        );

        amplitude.track('Cancel subscription', { priceId: currentSubscription.planId, title: plan.title, interval: currentSubscription.interval });
        onCancelSubscription();
      },
    });
  }, [amplitude, cancelMutation, currentSubscription.interval, currentSubscription.planId,
    onCancelSubscription]);

  return (
    <>
      <Text size="lg" align="center" sx={{ flex: '1 1 100%' }}>Cancel Subscription</Text>
      <Stack>
        <Text size="sm">
          Your subscription started on
          {' '}
          {dayjs(new Date(currentSubscription.startDate * 1000)).format('MMM DD, YYYY')}
          {' '}
          and renews
          {' '}
          {dayjs(new Date(currentSubscription.endDate * 1000)).format('MMM DD, YYYY')}
          .
        </Text>
      </Stack>
      <Text size="sm" sx={{ flex: '1 1 100%' }}>Cancelling your team subscription will affect members access to Growthflags.</Text>

      <Button variant="light" color="red" onClick={onCancelCurrentSubscription}>Cancel</Button>
    </>
  );
};

CurrentSubscriptionBlock.propTypes = {
  onCancelSubscription: PropTypes.func.isRequired,
  currentSubscription: PropTypes.shape({
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    interval: PropTypes.oneOf(['month', 'year']).isRequired,
    planId: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(CurrentSubscriptionBlock);
