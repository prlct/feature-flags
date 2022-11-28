import { useCallback, memo, useMemo } from 'react';
import moment from 'moment';
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

  const startSubscriptionDate = useMemo(
    () => moment(new Date(currentSubscription.startDate * 1000)).format('MMM DD, YYYY'),
    [currentSubscription.startDate],
  );
  const endSubscriptionDate = useMemo(
    () => moment(new Date(currentSubscription.endDate * 1000)).format('MMM DD, YYYY'),
    [currentSubscription.endDate],
  );

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
          {`Your subscription started on ${startSubscriptionDate} and renews ${endSubscriptionDate}.`}
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
    interval: PropTypes.oneOf(['month', 'year']).isRequired,
    planId: PropTypes.string.isRequired,
    startDate: PropTypes.number.isRequired,
    endDate: PropTypes.number.isRequired,
  }).isRequired,
};

export default memo(CurrentSubscriptionBlock);
