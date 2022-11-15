import PropTypes from 'prop-types';
import { Group, Stack, Card, Text, Paper, Center, Menu, UnstyledButton } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { useContext } from 'react';
import EmailCard from './email-card';
import SequenceMenu from './sequence-menu';
import CardSettingsButton from './card-settings-button';
import SequenceProgressBar from './sequence-progress-bar';
import { EmailSequencesContext } from '../email-sequences-context';

const Sequence = (props) => {
  const { sequence } = props;

  const { openTriggerModal, addEmptyEmail } = useContext(EmailSequencesContext);

  const addEmail = () => {
    addEmptyEmail(sequence);
  };

  return (
    <Paper withBorder mt={8}>
      <Stack p={8} sx={{ width: '280px' }}>
        <Group position="apart">
          <Text weight="bold">
            {sequence.name}
          </Text>
          <SequenceMenu sequence={sequence} />
        </Group>
        <SequenceProgressBar total={sequence.total} dropped={sequence.dropped} />
        <Card shadow="sm" p="sm" radius="sm" withBorder>
          <Stack spacing={0}>
            <Group position="apart">
              <Text size="lg" weight="bold">{sequence.trigger.name}</Text>
              <Menu withinPortal>
                <Menu.Target onClick={() => openTriggerModal(sequence)}>
                  <CardSettingsButton />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    Edit
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
            <Text size="sm">{sequence.trigger.description}</Text>
          </Stack>
        </Card>
        <Stack>
          {sequence.emails.map((email) => <EmailCard key={email.name} email={email} />)}
          <Center>
            <UnstyledButton onClick={addEmail}>
              <Text color="blue">
                <IconPlus size={16} />
                Add email
              </Text>
            </UnstyledButton>
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
    completed: PropTypes.number,
    total: PropTypes.number,
    dropped: PropTypes.number,
    trigger: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
    }),
    emails: PropTypes.arrayOf(PropTypes.shape({
      delay: PropTypes.number,
      name: PropTypes.string,
      enabled: PropTypes.bool,
      sent: PropTypes.number,
      unsubscribed: PropTypes.number,
    })),
  }).isRequired,
};

export default Sequence;
