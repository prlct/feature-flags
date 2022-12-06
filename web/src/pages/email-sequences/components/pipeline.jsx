import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Group, Paper, Space, Stack, Text, Button, Box, ScrollArea } from '@mantine/core';
import { openContextModal } from '@mantine/modals';

import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';

import Sequence from './sequence';
import SequenceMenu from './sequence-menu';

import { useStyles } from './styles';

const Pipeline = ({ id }) => {
  const { data } = emailSequencesApi.useGetSequences(id);
  const sequences = data?.results || [];

  const padSeqTo = 2;
  const paddedSequencesNumber = sequences.length >= padSeqTo ? 0 : padSeqTo - sequences.length;

  const { classes } = useStyles();

  const emptySequences = useMemo(() => (new Array(paddedSequencesNumber)
    .fill(null)
    .map(() => ({ _id: Math.random() * 10000 }))), [paddedSequencesNumber]);

  return (
    <ScrollArea>
      <Group align="stretch" noWrap>
        {sequences.map((sequence) => (
          <Sequence key={sequence._id} sequence={sequence} />
        ))}
        {emptySequences.map((seq) => (
          <Paper key={seq.id} withBorder className={classes.pipeline}>
            <Stack spacing={0}>
              <Group position="apart">
                <Text weight={600} size={18} style={{ lineHeight: '22px' }} color="#17181A">New sequence</Text>
                <SequenceMenu id={seq._id} sequence={seq} />
              </Group>
              <Space h="sm" />
              <Stack spacing="xs">
                <Button
                  className={classes.addButton}
                  variant="light"
                  onClick={() => openContextModal({ modal: 'triggerSelection', title: 'Add trigger', innerProps: {} })}
                >
                  + Add trigger
                </Button>
                <Button
                  className={classes.addButton}
                  variant="light"
                  onClick={() => openContextModal({ modal: 'sequenceEmail', title: 'Create email', innerProps: {} })}
                >
                  + Add email
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
        <Box mt={8}>
          <Button
            onClick={() => null}
            variant="light"
            className={classes.addButton}
            style={{ minWidth: 304 }}
          >
            + Add sequence
          </Button>
        </Box>
      </Group>
    </ScrollArea>
  );
};

Pipeline.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Pipeline;
