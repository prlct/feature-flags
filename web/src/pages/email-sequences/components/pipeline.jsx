import { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Group, Paper, Space, Stack, Text, Button, Box, ScrollArea } from '@mantine/core';

import Sequence from './sequence';
import SequenceMenu from './sequence-menu';

import { useStyles } from './styles';

const Pipeline = ({ sequences }) => {
  const padSeqTo = 2;
  const paddedSequencesNumber = sequences.length >= padSeqTo ? 0 : padSeqTo - sequences.length;

  const { classes } = useStyles();

  const emptySequences = useMemo(() => (new Array(paddedSequencesNumber)
    .fill(null)
    .map(() => ({ id: Math.random() * 10000 }))), [paddedSequencesNumber]);

  return (
    <ScrollArea>
      <Group align="stretch" noWrap>
        {sequences.map((sequence) => (
          <Sequence key={sequence.id} sequence={sequence} />
        ))}
        {emptySequences.map((seq) => (
          <Paper key={seq.id} withBorder className={classes.pipeline}>
            <Stack spacing={0}>
              <Group position="apart">
                <Text weight={600} size={18} style={{ lineHeight: '22px' }} color="#17181A">New sequence</Text>
                <SequenceMenu id={seq.id} sequence={seq} />
              </Group>
              <Space h="sm" />
              <Stack spacing="xs">
                <Button variant="light" onClick={() => openTriggerModal(seq)} className={classes.addButton}>
                  + Add trigger
                </Button>
                <Button variant="light" className={classes.addButton}>
                  + Add email
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
        <Box mt={8}>
          <Button
            onClick={() => openTriggerModal(null)}
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
  sequences: PropTypes.arrayOf(PropTypes.shape({})),
};

Pipeline.defaultProps = {
  sequences: [],
};

export default Pipeline;
