import { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Group, Paper, Space, Stack, Text, UnstyledButton, Box } from '@mantine/core';

import Sequence from './sequence';
import SequenceMenu from './sequence-menu';
import { EmailSequencesContext } from '../email-sequences-context';

const Pipeline = ({ sequences }) => {
  const padSeqTo = 2;
  const paddedSequencesNumber = sequences.length >= padSeqTo ? 0 : padSeqTo - sequences.length;

  const { openTriggerModal } = useContext(EmailSequencesContext);

  const emptySequences = useMemo(() => (new Array(paddedSequencesNumber)
    .fill(null)
    .map(() => ({ id: Math.random() * 10000 }))), [paddedSequencesNumber]);

  return (
    <Group align="stretch" noWrap>
      {sequences.map((sequence) => (
        <Sequence key={sequence.id} sequence={sequence} />
      ))}
      {emptySequences.map((seq) => (
        <Paper key={seq.id} withBorder mt={8} shadow="sm" p={8} radius="sm" sx={{ minWidth: 280 }}>
          <Stack spacing={0}>
            <Group position="apart">
              <Text>New sequence</Text>
              <SequenceMenu id={seq.id} sequence={seq} />
            </Group>
            <Space h="sm" />
            <Stack spacing="xs">
              <UnstyledButton onClick={() => openTriggerModal(seq)}>
                <Text size="sm" color="dimmed">+ Add trigger</Text>
              </UnstyledButton>
              <UnstyledButton>
                <Text size="sm" color="dimmed">+ Add email</Text>
              </UnstyledButton>
            </Stack>
          </Stack>
        </Paper>
      ))}
      <Box mt={8}>
        <UnstyledButton onClick={() => openTriggerModal(null)}>
          <Text color="blue">
            Add sequence
          </Text>
        </UnstyledButton>
      </Box>
    </Group>
  );
};

Pipeline.propTypes = {
  sequences: PropTypes.arrayOf(PropTypes.shape({})),
};

Pipeline.defaultProps = {
  sequences: [],
};

export default Pipeline;
