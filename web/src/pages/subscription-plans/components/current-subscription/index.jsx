import { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Text,
} from '@mantine/core';

import { subscriptionApi } from 'resources/subscription';

const CurrentSubscriptionBlock = ({ onCancelSubscription }) => {
  const cancelMutation = subscriptionApi.useCancelMutation();

  const onCancelCurrentSubscription = useCallback(() => {
    cancelMutation.mutate(null, {
      onSuccess: () => {
        onCancelSubscription();
      },
    });
  }, [onCancelSubscription]);

  return (
    <>
      <Text size="lg" align="center" sx={{ flex: '1 1 100%' }}>Cancel Subscription</Text>
      <Text size="sm" sx={{ flex: '1 1 100%' }}>Cancelling your team subscription will affect members access to Growthflags.</Text>

      <Button variant="light" color="red" onClick={onCancelCurrentSubscription}>Cancel</Button>
    </>
  );
};

CurrentSubscriptionBlock.propTypes = {
  onCancelSubscription: PropTypes.func.isRequired,
};

export default memo(CurrentSubscriptionBlock);
