import { useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';

import {
  Badge,
  Button,
  Card,
  Container,
  MediaQuery,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons';

import { subscriptionApi } from 'resources/subscription';

import { useStyles } from './styles';

const PlanItem = (props) => {
  const { classes } = useStyles();

  const subscribeMutation = subscriptionApi.useSubscribe();
  const { data: currentSubscription } = subscriptionApi.useGetCurrent();

  const isCurrentSubscription = useMemo(() => {
    if (!currentSubscription) {
      return '0' === props.id
    }

    return currentSubscription.planId === props.id
  }, [currentSubscription?.planId, props.id]);

  const priceText = useMemo(() => {
    if (props.price) {
      return (
        <>
          <Text sx={{ display: 'inline', fontSize: '48px' }} weight="600">${props.price}</Text>
          <Text sx={{ display: 'inline' }} size="md">/month</Text>
        </>
      );
    }

    return <Text sx={{ fontSize: '48px' }} weight="600">Free</Text>
  }, [props.price]);

  const renderFeatureList = useCallback(() =>
    props.features.map((item, index) => (
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
    []
  );

  const onClick = useCallback(() => {
    subscribeMutation.mutate(props.id);
  }, [props.id]);

  return (
    <MediaQuery smallerThan="sm" styles={{ flex: '1 1 100%' }}>
      <Card withBorder shadow="md" radius="lg" sx={{ flex: '1 1' }}>
        <Text size="xl">{props.title}</Text>
        <Space h="md" />
        {priceText}

        <Space h="lg" />

        <Stack>
          {renderFeatureList()}
        </Stack>

        <Space h={64} />

        <Button disabled={isCurrentSubscription} fullWidth onClick={onClick}>
          {isCurrentSubscription ? 'Current plan' : `Get ${props.title}`}
        </Button>
      </Card>
    </MediaQuery>
  );
};

PlanItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  features: PropTypes.arrayOf(PropTypes.node),
};

PlanItem.defaultProps = {
  features: [],
};

export default memo(PlanItem);
