import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Confetti from 'react-confetti'
import {
  Badge,
  Container,
  Modal,
  Stack,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons';

import * as routes from 'routes';
import subscriptionList from 'pages/subscription-plans/subscription-list';

import { useStyles } from './styles';

const PaymentSuccessModal = () => {
  const { classes } = useStyles();
  const router = useRouter()

  const [opened, setOpened] = useState(false);
  const [activeSubscriptionPlan, setActiveSubscriptionPlan] = useState();

  const onClose = useCallback(() => {
    setOpened(false);
    router.replace(routes.route.home, undefined, { shallow: true });
  }, []);

  useEffect(() => {
    if (router.query.subscriptionPlan) {
      setOpened(true);
      setActiveSubscriptionPlan(subscriptionList.find((item) => item.planIds[router.query.period] === router.query.subscriptionPlan));
    }
  }, [router.query.subscriptionPlan]);

  const renderFeatureList = useCallback(() =>
    activeSubscriptionPlan.features.map((item, index) => (
      <Container
        key={index}
        fluid
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          padding: 0,
        }}
      >
        <Badge
          variant="filled"
          classNames={{
            root: classes.badgeContainer,
            inner: classes.badgeInner,
          }}
        >
          <IconCheck size={18} />
        </Badge>
        <Space w={8} />
        {item}
      </Container>
    )),
    [activeSubscriptionPlan]
  );

  return (
    <>
      <Modal
        centered
        overlayOpacity={0}
        title={
          <Title order={3}>
            Success
          </Title>
        }
        opened={opened}
        onClose={onClose}
      >
        <Text>You have successfully upgraded your plan.</Text>
        {!!activeSubscriptionPlan && (
          <>
            <Text>List of available features:</Text>
            <Space h={16} />
            <Stack>
              {renderFeatureList()}
            </Stack>
          </>
        )}
      </Modal>
      {opened && <Confetti />}
    </>
  )
};

export default PaymentSuccessModal;
