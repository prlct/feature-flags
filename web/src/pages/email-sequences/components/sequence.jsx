import PropTypes from 'prop-types';
import { Group, Stack, Card, Text, Paper, Center, Menu, Button, ActionIcon } from '@mantine/core';
import { useContext } from 'react';
import { IconEdit } from '@tabler/icons';
import EmailCard from './email-card';
import SequenceMenu from './sequence-menu';
import SequenceProgressBar from './sequence-progress-bar';

import { useStyles } from './styles';

const Sequence = (props) => {
  const { sequence } = props;

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
        <Card shadow="sm" p="sm" radius="sm" withBorder mt={16} sx={{ borderRadius: 12 }}>
          <Stack spacing={12}>
            <Group position="apart">
              <Text size="lg" weight="bold">{sequence.trigger.name}</Text>
              <Menu withinPortal>
                <Menu.Target onClick={() => openTriggerModal(sequence)}>
                  <ActionIcon><IconEdit size={24} color="gray" /></ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    Edit
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
            <Text size={14} color="#797C80" style={{ lineHeight: '17px' }}>{sequence.trigger.description}</Text>
          </Stack>
        </Card>
        <Stack spacing={24}>
          {sequence.emails.map((email) => <EmailCard key={email.name} email={email} />)}
          <Center>
            <Button variant="light" onClick={addEmail} className={classes.addButton}>
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
