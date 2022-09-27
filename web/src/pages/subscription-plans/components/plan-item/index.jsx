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
      return '0' === props.planIds[props.period]
    }

    if (currentSubscription.interval === 'year') {
      return Object.values(props.planIds).includes(currentSubscription.planId);
    }

    return currentSubscription.planId === props.planIds[props.period];
  }, [
    currentSubscription?.planId,
    props.planIds.month,
    props.planIds.year,
    props.period
  ]);

  const priceText = useMemo(() => {
    if (props.price[props.period]) {
      return (
        <>
          <Text sx={{ display: 'inline', fontSize: '48px' }} weight="600">${props.price[props.period]}</Text>
          <Text sx={{ display: 'inline' }} size="md">/{props.period}</Text>
        </>
      );
    }

    return <Text sx={{ fontSize: '48px' }} weight="600">Free</Text>
  }, [
    props.price.month,
    props.price.year,
    props.period
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

  const onClick = useCallback(() => {
    subscribeMutation.mutate({ priceId: props.planIds[props.period], period: props.period });
  }, [
    props.planIds.month,
    props.planIds.year,
    props.period,
  ]);

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
  period: PropTypes.oneOf('month', 'year').isRequired,
};

PlanItem.defaultProps = {
  features: [],
};

export default memo(PlanItem);
