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
import { useAmplitude } from 'contexts/amplitude-context';

import { useStyles } from './styles';

const PlanItem = (props) => {
  const {
    currentSubscription,
    planIds,
    price,
    features,
    interval,
    title,
    onPreviewUpgrade,
  } = props;
  const { classes, cx } = useStyles();

  const subscribeMutation = subscriptionApi.useSubscribe();

  const amplitude = useAmplitude();

  const isCurrentSubscription = useMemo(() => {
    if (!currentSubscription) {
      return planIds[interval] === '0';
    }

    return currentSubscription.planId === planIds[interval];
  }, [currentSubscription, interval, planIds]);

  const onClick = useCallback(() => {
    if (currentSubscription) {
      onPreviewUpgrade({ priceId: planIds[interval], title });

      return;
    }

    subscribeMutation.mutate({ priceId: planIds[interval], interval }, {
      onSuccess: () => {
        amplitude.track('Subscribe', { priceId: planIds[interval], title, interval });
      } });
  }, [amplitude, currentSubscription, subscribeMutation, planIds, interval, onPreviewUpgrade,
    title]);

  const priceText = useMemo(() => {
    if (price[interval]) {
      return (
        <>
          <Text sx={{ display: 'inline', fontSize: '48px' }} weight="600">
            $
            {price[interval]}
          </Text>
          <Text
            sx={(theme) => ({
              display: 'inline',
              color: theme.colors.dark[3],
            })}
            size="xs"
          >
            /
            {' '}
            {interval}
          </Text>
        </>
      );
    }

    return <Text sx={{ fontSize: '48px' }} weight="600">Free</Text>;
  }, [interval, price]);

  /* eslint-disable react/no-array-index-key */
  const renderFeatureList = useCallback(
    () => features.map((item, index) => (
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
    [classes.icon, features],
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
          <Title order={3}>{title}</Title>
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
          <Button
            sx={(theme) => ({ backgroundColor: theme.colors.blue[6] })}
            fullWidth
            onClick={onClick}
          >
            Get
            {' '}
            {title}
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
    year: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.shape({
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  features: PropTypes.arrayOf(PropTypes.node),
  interval: PropTypes.oneOf(['month', 'year']).isRequired,
  onPreviewUpgrade: PropTypes.func.isRequired,
};

PlanItem.defaultProps = {
  currentSubscription: null,
  features: [],
};

export default memo(PlanItem);
