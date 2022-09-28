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
  Title,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons';

import { subscriptionApi } from 'resources/subscription';

import { useStyles } from './styles';

const PlanItem = (props) => {
  const { classes, cx } = useStyles();

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
      props.onPrevewUpgrade({ priceId: props.planIds[props.interval], title: props.title });

      return;
    }

    subscribeMutation.mutate({ priceId: props.planIds[props.interval], interval: props.interval });
  }, [
    props.interval,
    props.currentSubscription,
  ]);

  const priceText = useMemo(() => {
    if (props.price[props.interval]) {
      return (
        <>
          <Text sx={{ display: 'inline', fontSize: '48px' }} weight="600">${props.price[props.interval]}</Text>
          <Text
            sx={(theme) => ({
              display: 'inline',
              color: theme.colors.dark[3],
            })}
            size="xs"
          >
            / {props.interval}
          </Text>
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
        <IconCheck size={14} className={classes.icon} />
        <Space w={8} />
        {item}
      </Container>
    )),
    []
  );

  return (
    <MediaQuery smallerThan="sm" styles={{ flex: '1 1 100%' }}>
      <Card
        withBorder
        radius="sm"
        p={32}
        className={cx(classes.card, {
          [classes.active]: isCurrentSubscription,
        })}
      >
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title order={3}>{props.title}</Title>
          {isCurrentSubscription && (
            <Badge
              size="lg"
              sx={(theme) => ({
                backgroundColor: theme.colors.blue[6],
                color: theme.white,
              })}
            >
              Current plan
            </Badge>
        )}
        </Container>
        <Space h={24} />
        {priceText}

        <Space h={40} />

        <Stack>
          {renderFeatureList()}
        </Stack>

        <Space h={64} />

        {!isCurrentSubscription && (
          <Button sx={(theme) => ({ backgroundColor: theme.colors.blue[6] })} fullWidth onClick={onClick}>
            Get {props.title}
          </Button>
        )}
      </Card>
    </MediaQuery>
  );
};

PlanItem.propTypes = {
  currentSubscription: PropTypes.oneOfType([
    PropTypes.shape({
      planId: PropTypes.string,
    }),
    PropTypes.string,
  ]),
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
