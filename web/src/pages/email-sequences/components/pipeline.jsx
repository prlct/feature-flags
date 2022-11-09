import { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Group, Paper, Space, Stack, Text, UnstyledButton } from '@mantine/core';

import Sequence from './sequence';
import SequenceMenu from './sequence-menu';
import { EmailSequencesContext } from '../email-sequences-context';

const Pipeline = ({ sequences }) => {
  const padSeqTo = 4;
  const paddedSequencesNumber = sequences.length >= padSeqTo ? 0 : padSeqTo - sequences.length;

  const { dispatch } = useContext(EmailSequencesContext);

  const addTriggerHandler = (sequence) => {
    dispatch({ type: 'open-modal', name: 'triggerSelection' });
    dispatch({ type: 'set-current-sequence', sequence });
  };

  const emptySequences = useMemo(() => (new Array(paddedSequencesNumber)
    .fill(null)
    .map(() => ({ id: Math.random() * 10000 }))), [paddedSequencesNumber]);

  return (
    <Group align="stretch" noWrap>
      {sequences.map((sequence) => (
        <Sequence key={sequence.id} sequence={sequence} />
      ))}
      {emptySequences.map((seq) => (
        <Paper key={seq.id} withBorder mt={8} shadow="sm" p={8} radius="sm" sx={{ minWidth: 260 }}>
          <Stack spacing={0}>
            <Group position="apart">
              <Text>New sequence</Text>
              <SequenceMenu id={seq.id} sequence={seq} />
            </Group>
            <Space h="sm" />
            <Stack spacing="xs">
              <UnstyledButton onClick={() => addTriggerHandler(seq)}><Text size="sm" color="dimmed">+ Add trigger</Text></UnstyledButton>
              <UnstyledButton><Text size="sm" color="dimmed">+ Add audience</Text></UnstyledButton>
              <UnstyledButton><Text size="sm" color="dimmed">+ Add email</Text></UnstyledButton>
            </Stack>
          </Stack>
        </Paper>
      ))}
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
