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
  Tooltip,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCheck } from '@tabler/icons';

import { subscriptionApi } from 'resources/subscription';
import { useAmplitude } from 'contexts/amplitude-context';

import { useStyles } from './styles';

const PlanItem = (props) => {
  const {
    currentSubscription,
    planIds,
    price,
    chapters,
    interval,
    title,
    onPreviewUpgrade,
    isOwnerCompany,
  } = props;
  const { classes, cx } = useStyles();
  const matches = useMediaQuery('(max-width: 768px)');

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
          <Text sx={{ display: 'inline', fontSize: matches ? 18 : 48 }} weight="600">
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

    return <Text sx={{ fontSize: matches ? 18 : 48 }} weight="600">Free</Text>;
  }, [interval, price, matches]);

  /* eslint-disable react/no-array-index-key */
  const renderFeatureList = useCallback(
    () => chapters.map((chapter, index) => (
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
    [classes.icon, chapters],
  );

  return (
    <MediaQuery smallerThan="sm" styles={{ flex: '1 1 100%' }}>
      <Card
        withBorder
        radius="sm"
        p={matches ? 16 : 32}
        className={cx(classes.card, {
          [classes.active]: isCurrentSubscription,
        })}
      >
        <Container
          sx={{
            padding: matches && 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title order={matches ? 5 : 3}>{title}</Title>
          {isCurrentSubscription && (
            <Badge
              size="lg"
              variant="filled"
              className={classes.badge}
            >
              Current plan
            </Badge>
          )}
        </Container>
        <Space h={matches ? 12 : 24} />
        {priceText}

        <Space h={matches ? 12 : 40} />

        <Stack spacing={matches ? 5 : 16}>
          {renderFeatureList()}
        </Stack>

        <Space h={matches ? 24 : 64} />

        {!isCurrentSubscription && (
          <Tooltip label="Only available for admin" events={{ hover: !isOwnerCompany }}>
            <Button
              fullWidth
              onClick={onClick}
            >
              Get
              {' '}
              {title}
            </Button>
          </Tooltip>
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
  chapters: PropTypes.arrayOf(PropTypes.node),
  interval: PropTypes.oneOf(['month', 'year']).isRequired,
  onPreviewUpgrade: PropTypes.func.isRequired,
  isOwnerCompany: PropTypes.bool,
};

PlanItem.defaultProps = {
  currentSubscription: null,
  chapters: [],
  isOwnerCompany: true,
};

export default memo(PlanItem);
