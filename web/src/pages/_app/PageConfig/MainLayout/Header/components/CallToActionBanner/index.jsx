import { useCallback } from 'react';
import router from 'next/router';

import * as routes from 'routes';

import {
  Button,
  Container,
  Text,
  Space,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';

import { useStyles } from './styles';

const CallToActionBanner = () => {
  const { classes } = useStyles();

  const handleClick = useCallback(() => {
    router.push(routes.route.subscriptionPlans);
  }, []);

  return (
    <Container
      fluid
      className={classes.container}
    >
      <IconAlertCircle size={16} className={classes.icon} />
      <Space w={16} />
      <Text>You have reached plan's limits. Upgrage plan to increase your limits.</Text>
      <Space w={16} />
      <Button sx={{ height: '36px' }} onClick={handleClick}>Upgrade</Button>
    </Container>
  )
};

export default CallToActionBanner;
