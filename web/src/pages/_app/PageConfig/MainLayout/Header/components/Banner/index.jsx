import { useCallback } from 'react';
import router from 'next/router';

import * as routes from 'routes';

import {
  Button,
  Container,
  Text,
  Space,
} from '@mantine/core';

const Banner = () => {
  const handleClick = useCallback(() => {
    router.push(routes.route.subscriptionPlans);
  }, []);

  return (
    <Container
      fluid
      sx={(theme) => ({
        position: 'sticky',
        top: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '64px',
        backgroundColor: theme.colors.gray[5],
        zIndex: 100,
      })}
    >
      <Text>You have reached plan's limits. Upgrage plan to increase your limits.</Text>
      <Space w="md" />
      <Button onClick={handleClick}>Upgrade</Button>
    </Container>
  )
};

export default Banner;
