import { useCallback } from 'react';
import router from 'next/router';
import PropTypes from 'prop-types';

import * as routes from 'routes';

import {
  Button,
  Text,
  Alert,
  Group,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import { notificationMessages } from './limit-notifications';

import { useStyles } from './styles';

const CallToActionBanner = ({
  limitType,
  limit,
  currentPlan,
  usagePercentage,
  handleClose,
}) => {
  const { classes } = useStyles();

  const handleClick = useCallback(() => {
    router.push(routes.route.subscriptionPlans);
  }, []);

  const handleCloseAlert = useCallback(() => {
    handleClose(limitType);
  }, [handleClose, limitType]);

  let percentage = '';
  if (usagePercentage >= 100) {
    percentage = '100';
  } else if (usagePercentage >= 95) {
    percentage = '95';
  } else if (usagePercentage >= 90) {
    percentage = '90';
  }

  if (limitType === 'email') {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        color="red"
        withCloseButton
        closeButtonLabel="Close alert"
        variant="outline"
        className={classes.alert}
        onClose={handleCloseAlert}
      >
        Hey! You have reached 100% limit of
        {' '}
        {limit}
        {' '}
        emails per day.
        Sending the remaining messages scheduled for today has been postponed until tomorrow.
      </Alert>

    );
  }

  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      color="red"
      withCloseButton
      closeButtonLabel="Close alert"
      variant="outline"
      className={classes.alert}
      onClose={handleCloseAlert}
    >
      <Group className={classes.container}>
        <Text sx={{ fontSize: 14 }}>{notificationMessages[currentPlan][percentage]}</Text>
        {router.pathname !== '/subscription-plans'
      && currentPlan !== 'pro'
      && (
        <Button size="xs" sx={{ height: '36px' }} onClick={handleClick}>Upgrade</Button>
      )}
      </Group>
    </Alert>

  );
};

CallToActionBanner.propTypes = {
  limitType: PropTypes.string.isRequired,
  currentPlan: PropTypes.string,
  usagePercentage: PropTypes.string,
  limit: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
};

CallToActionBanner.defaultProps = {
  currentPlan: 'free',
  usagePercentage: 0,
  limit: 0,
};

export default CallToActionBanner;
