import PropTypes from 'prop-types';
import {
  Group,
  Stack,
  Card,
  Text,
  Paper,
  Menu,
  Button,
  ActionIcon,
  LoadingOverlay,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import { openContextModal } from '@mantine/modals';
import { useMediaQuery } from '@mantine/hooks';

import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';

import EmailCard from './email-card';
import SequenceMenu from './sequence-menu';
import SequenceProgressBar from './sequence-progress-bar';
import { useStyles } from './styles';

const Sequence = (props) => {
  const { sequence } = props;
  const { enabled } = sequence;

  const { data,
    isRefetching,
    isLoading,
    isFetching,
  } = emailSequencesApi.useGetSequenceEmails(sequence?._id);

  const emails = data?.results || [];
  const { classes } = useStyles();
  const matches = useMediaQuery('(max-width: 768px)');

  return (
    <Paper withBorder className={[classes.pipeline, !enabled && classes.pipelineDisabled]}>
      <LoadingOverlay visible={isRefetching || isLoading || isFetching} />
      <Stack>
        <Group position="apart">
          <Text weight={600} size={matches ? 16 : 18} style={{ lineHeight: '22px' }} color="#17181A">
            {sequence.name}
          </Text>
          <SequenceMenu sequence={sequence} />
        </Group>
        <SequenceProgressBar total={sequence.total} dropped={sequence.dropped} />
        {sequence.trigger && (
        <Card shadow="sm" p="sm" radius="sm" withBorder mt={!matches && 16} sx={{ borderRadius: 12 }}>
          <Stack spacing={12}>
            <Group position="apart">
              <Text size={matches ? 16 : 'lg'} weight="bold">{sequence.trigger?.name}</Text>
              <Menu withinPortal>
                <Menu.Target onClick={() => openContextModal({
                  modal: 'triggerSelection',
                  size: 696,
                  innerProps: { sequence },
                  fullScreen: matches,
                })}
                >
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
          <Stack>
            {emails.map((email) => (
              <EmailCard
                key={email.name}
                email={email}
              />
            ))}
          </Stack>
          <Stack>
            {!sequence.trigger && (
            <Button
              className={classes.addButton}
              variant="light"
              onClick={() => openContextModal({
                modal: 'triggerSelection',
                title: 'Add trigger',
                innerProps: { pipelineId: sequence.pipelineId, sequence },
                size: 696,
                fullScreen: matches,
                styles: { title: { fontSize: 20, fontWeight: 600 } },
              })}
            >
              + Add trigger
            </Button>
            )}

            <Button
              className={classes.addButton}
              variant="light"
              onClick={() => openContextModal({
                modal: 'sequenceEmail',
                size: 800,
                fullScreen: matches,
                title: 'Add email',
                innerProps: { sequenceId: sequence?._id },
                styles: { title: { fontSize: 20, fontWeight: 600 } },
              })}
            >
              + Add email
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

Sequence.propTypes = {
  sequence: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    pipelineId: PropTypes.string.isRequired,
    name: PropTypes.string,
    completed: PropTypes.number,
    total: PropTypes.number,
    dropped: PropTypes.number,
    enabled: PropTypes.bool,
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
