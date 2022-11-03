import { useCallback, memo } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import {
  Button,
  Text,
  Stack,
} from '@mantine/core';
import { subscriptionApi } from 'resources/subscription';

const CurrentSubscriptionBlock = ({ onCancelSubscription, currentSubscription }) => {
  const cancelMutation = subscriptionApi.useCancelMutation();

  const onCancelCurrentSubscription = useCallback(() => {
    cancelMutation.mutate(null, {
      onSuccess: () => {
        onCancelSubscription();
      },
    });
  }, [cancelMutation, onCancelSubscription]);

  return (
    <>
      <Text size="lg" align="center" sx={{ flex: '1 1 100%' }}>Cancel Subscription</Text>
      <Stack>
        <Text size="sm">
          Your subscription started on
          {' '}
          {dayjs(currentSubscription.startDate).format('MMM DD, YYYY')}
          {' '}
          and expires
          {' '}
          {dayjs(currentSubscription.endDate).format('MMM DD, YYYY')}
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
  }).isRequired,
};

export default memo(CurrentSubscriptionBlock);
