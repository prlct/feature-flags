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

import { useStyles } from './styles';

const PlanItem = (props) => {
  const { classes } = useStyles();

  const priceText = useMemo(() => {
    if (props.price) {
      return (
        <>
          <Text sx={{ display: 'inline', fontSize: '48px' }} weight="600">${props.price}</Text>
          <Text sx={{ display: 'inline' }} size="md">/month</Text>
        </>
      )
    }

    return <Text sx={{ fontSize: '48px' }} weight="600">Free</Text>
  }, [props.price]);

  const renderFeatureList = useCallback(() =>
    props.features.map((item) => (
      <Container
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
    props.onSelectPlan(props.id);
  }, [props.id, props.onClick]);

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

        <Button fullWidth onClick={onClick}>Get {props.title}</Button>
      </Card>
    </MediaQuery>
  );
};

export default memo(PlanItem);
