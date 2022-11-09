import PropTypes from 'prop-types';
import { Card, Group, Space, Stack, Switch, Text } from '@mantine/core';

import Arrow from './arrow';
import CardSettingsButton from './CardSettingsButton';

const EmailCard = (props) => {
  const { value } = props;
  const {
    name,
    enabled,
    sent,
    unsubscribed,
    converted,
    reactions,
    delay,
  } = value;

  return (
    <Stack>
      <Arrow days={delay} />
      <Card shadow="sm" p="sm" withBorder>
        <Stack spacing={0}>
          <Group position="apart">
            <Text size="lg" weight="bold">{name}</Text>
            <CardSettingsButton />
          </Group>
          <Space h="sm" />
          <Switch label={<Text weight="bold" size="sm" pr={16}>Enable</Text>} labelPosition="left" checked={enabled} />
          <Space h="sm" />
          <Group position="apart">
            <Text size="sm">
              Sent:
            </Text>
            <Text size="sm" weight="bold">
              {sent}
            </Text>
          </Group>
          <Group position="apart">
            <Text size="sm">
              Unsubscribed:
            </Text>
            <Text size="sm" weight="bold">
              {unsubscribed}
            </Text>
          </Group>
          <Group position="apart">
            <Text size="sm">
              Converted:
            </Text>
            <Text size="sm" weight="bold">
              {converted}
            </Text>
          </Group>

          <Group mt={16} spacing="xl">
            <Group align="center" sx={{ background: '#edf4ff', borderRadius: 16 }} px={6} position="apart" spacing={6}>
              <Text size="lg">&#128512;</Text>
              <Text size="xs">{reactions.happy}</Text>
            </Group>
            <Group align="center" sx={{ background: '#edf4ff', borderRadius: 16 }} px={6} position="apart" spacing={6}>
              <Text size="lg">&#128528;</Text>
              <Text size="xs">{reactions.unhappy}</Text>
            </Group>
            <Group align="center" sx={{ background: '#edf4ff', borderRadius: 16 }} px={6} position="apart" spacing={6}>
              <Text size="lg">&#128525;</Text>
              <Text size="xs">{reactions.love}</Text>
            </Group>
          </Group>

        </Stack>
      </Card>
    </Stack>
  );
};

EmailCard.propTypes = {
  value: PropTypes.shape({
    id: PropTypes.string,
    delay: PropTypes.number,
    name: PropTypes.string,
    enabled: PropTypes.bool,
    sent: PropTypes.number,
    unsubscribed: PropTypes.number,
    converted: PropTypes.number,
    reactions: PropTypes.shape({
      happy: PropTypes.number,
      unhappy: PropTypes.number,
      love: PropTypes.number,
    }),
  }).isRequired,
};

export default EmailCard;
