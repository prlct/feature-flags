import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Confetti from 'react-confetti';
import {
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
  const router = useRouter();

  const [opened, setOpened] = useState(false);
  const [activeSubscriptionPlan, setActiveSubscriptionPlan] = useState();

  const onClose = useCallback(() => {
    setOpened(false);
    router.replace(routes.route.home, undefined, { shallow: true });
  }, [router]);

  useEffect(() => {
    if (router.query.subscriptionPlan) {
      setOpened(true);
      setActiveSubscriptionPlan(
        subscriptionList.find(
          (item) => item.planIds[router.query.interval] === router.query.subscriptionPlan,
        ),
      );
    }
  }, [router.query.interval, router.query.subscriptionPlan]);

  /* eslint-disable react/no-array-index-key */
  const renderFeatureList = useCallback(
    () => activeSubscriptionPlan.chapters.map((chapter, index) => (
      <Stack
        key={index}
        fluid
        spacing={10}
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          padding: 0,
        }}
      >
        <Text sx={{ width: '100%' }}>{chapter.chapterTitle[0]}</Text>
        {chapter.chaptersList.map((item, index) => (
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
            <IconCheck size={16} className={classes.icon} />
            <Space w={8} />
            {item}
          </Container>
        ))}
      </Stack>

    )),
    [activeSubscriptionPlan, classes.icon],
  );

  return (
    <>
      <Modal
        centered
        overlayOpacity={0}
        title={(
          <Title order={3}>
            Success
          </Title>
        )}
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
  );
};

export default PaymentSuccessModal;
