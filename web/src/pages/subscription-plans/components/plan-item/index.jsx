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

  const isCurrentSubscription = useMemo(() => {
    if (!props.currentSubscription) {
      return '0' === props.planIds[props.interval]
    }

    return props.currentSubscription.planId === props.planIds[props.interval];
  }, [
    props.currentSubscription?.planId,
    props.interval
  ]);

  const onClick = useCallback(() => {
    if (props.currentSubscription) {
      props.onPrevewUpgrade(props.planIds[props.interval]);

      return;
    }

    subscribeMutation.mutate({ priceId: props.planIds[props.interval], interval: props.interval });
  }, [
    props.interval,
  ]);

  const priceText = useMemo(() => {
    if (props.price[props.interval]) {
      return (
        <>
          <Text sx={{ display: 'inline', fontSize: '48px' }} weight="600">${props.price[props.interval]}</Text>
          <Text sx={{ display: 'inline' }} size="md">/{props.interval}</Text>
        </>
      );
    }

    return <Text sx={{ fontSize: '48px' }} weight="600">Free</Text>
  }, [
    props.interval
  ]);

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
  currentSubscription: PropTypes.shape({
    planId: PropTypes.string,
  }),
  planIds: PropTypes.shape({
    month: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired
  }).isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.shape({
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }),
  features: PropTypes.arrayOf(PropTypes.node),
  interval: PropTypes.oneOf(['month', 'year']).isRequired,
  onPrevewUpgrade: PropTypes.func.isRequired,
};

PlanItem.defaultProps = {
  currentSubscription: null,
  features: [],
};

export default memo(PlanItem);
