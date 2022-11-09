import PropTypes from 'prop-types';
import { Group, Stack, Card, Text, Paper, Center } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import EmailCard from './email-card';
import SequenceMenu from './sequence-menu';
import CardSettingsButton from './CardSettingsButton';

const Sequence = (props) => {
  const { sequence } = props;

  return (
    <Paper withBorder mt={8}>
      <Stack p={8} sx={{ minWidth: '260px' }}>
        <Group position="apart">
          <Text>{sequence.name}</Text>
          <SequenceMenu sequence={sequence} />
        </Group>
        <Card shadow="sm" p="sm" radius="sm" withBorder>
          <Stack spacing={0}>
            <Group position="apart">
              <Text size="lg" weight="bold">{sequence.trigger.name}</Text>
              <CardSettingsButton />
            </Group>
            <Text size="sm">{sequence.trigger.description}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" p="sm" radius="sm" withBorder>
          <Stack>
            <Group position="apart">
              <Text size="lg" weight="bold">{sequence.audience.name}</Text>
              <CardSettingsButton />
            </Group>
            <Text size="sm">{sequence.audience.value}</Text>
          </Stack>
        </Card>

        <Stack>
          {sequence.emails.map((email) => <EmailCard key={email.name} value={email} />)}
          <Center>
            <Text color="blue">
              <IconPlus size={16} />
              Add email
            </Text>
          </Center>
        </Stack>
      </Stack>
    </Paper>
  );
};

Sequence.propTypes = {
  sequence: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    trigger: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
    }),
    audience: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    }),
    emails: PropTypes.arrayOf(PropTypes.shape({
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
    })),
  }).isRequired,
};

export default Sequence;
