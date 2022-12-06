import PropTypes from 'prop-types';
import { Group, Stack, Card, Text, Paper, Center, Menu, Button, ActionIcon } from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import { openContextModal } from '@mantine/modals';

import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';

import EmailCard from './email-card';
import SequenceMenu from './sequence-menu';
import SequenceProgressBar from './sequence-progress-bar';
import { useStyles } from './styles';

const Sequence = (props) => {
  const { sequence } = props;

  const { data } = emailSequencesApi.useGetSequenceEmails(sequence?._id);

  const emails = data?.results || [];
  const { classes } = useStyles();

  return (
    <Paper withBorder className={classes.pipeline}>
      <Stack>
        <Group position="apart">
          <Text weight={600} size={18} style={{ lineHeight: '22px' }} color="#17181A">
            {sequence.name}
          </Text>
          <SequenceMenu sequence={sequence} />
        </Group>
        <SequenceProgressBar total={sequence.total} dropped={sequence.dropped} />
        {sequence.trigger && (
        <Card shadow="sm" p="sm" radius="sm" withBorder mt={16} sx={{ borderRadius: 12 }}>
          <Stack spacing={12}>
            <Group position="apart">
              <Text size="lg" weight="bold">{sequence.trigger?.name}</Text>
              <Menu withinPortal>
                <Menu.Target onClick={() => openContextModal({ modal: 'triggerSelection', innerProps: { sequence } })}>
                  <ActionIcon><IconEdit size={24} color="gray" /></ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    Edit
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
            <Text size={14} color="#797C80" style={{ lineHeight: '17px' }}>{sequence.trigger?.description}</Text>
          </Stack>
        </Card>
        )}
        <Stack spacing={24}>
          {emails.map((email) => <EmailCard key={email.name} email={email} />)}
          <Center>
            <Button
              className={classes.addButton}
              variant="light"
              onClick={() => openContextModal({ modal: 'sequenceEmail', size: 800, innerProps: { sequenceId: sequence?._id } })}
            >
              + Add email
            </Button>
          </Center>
        </Stack>
      </Stack>
    </Paper>
  );
};

Sequence.propTypes = {
  sequence: PropTypes.shape({
    _id: PropTypes.string.isRequired,
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
