import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Group, Paper, Space, Stack, Text, Button, Box, ScrollArea, LoadingOverlay } from '@mantine/core';
import { openContextModal } from '@mantine/modals';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';

import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';

import { useAmplitude } from 'contexts/amplitude-context';
import Sequence from './sequence';
import SequenceMenu from './sequence-menu';

import { useStyles } from './styles';
import { ENV, LOCAL_STORAGE_ENV_KEY } from '../../../helpers/constants';

const Pipeline = ({ id }) => {
  const {
    data,
    isRefetching,
    isLoading,
    isFetching,
  } = emailSequencesApi.useGetSequences(id);
  const {
    mutate: handleAddSequence,
    isLoading: isSequenceCreateInProgress,
  } = emailSequencesApi.useAddSequence(id);

  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });

  const amplitude = useAmplitude();

  const sequences = data || [];

  const padSeqTo = 2;
  const paddedSequencesNumber = sequences.length >= padSeqTo ? 0 : padSeqTo - sequences.length;

  const { classes } = useStyles();
  const matches = useMediaQuery('(max-width: 768px)');

  const emptySequences = useMemo(() => (new Array(paddedSequencesNumber)
    .fill(null)
    .map(() => ({ _id: `${Math.random() * 10000}` }))), [paddedSequencesNumber]);

  const loaderVisible = isLoading || isRefetching || isFetching || isSequenceCreateInProgress;

  return (
    <ScrollArea>
      <LoadingOverlay visible={loaderVisible} />
      <Group align="stretch" noWrap>
        {sequences.map((sequence) => (
          <Sequence key={sequence._id} sequence={sequence} />
        ))}
        {emptySequences.map((seq) => (
          <Paper key={seq._id} withBorder className={classes.pipeline}>
            <Stack spacing={0}>
              <Group position="apart">
                <Text weight={600} size={matches ? 16 : 18} style={{ lineHeight: '22px' }} color="#17181A">New sequence</Text>
                <SequenceMenu id={seq._id} sequence={seq} />
              </Group>
              <Space h="sm" />
              <Stack spacing="xs">
                <Button
                  className={classes.addButton}
                  variant="light"
                  onClick={() => openContextModal({
                    modal: 'triggerSelection',
                    title: 'Add trigger',
                    innerProps: { pipelineId: id },
                    size: 696,
                    fullScreen: matches,
                    styles: { title: { fontSize: 20, fontWeight: 600 } },
                  })}
                >
                  + Add trigger
                </Button>
                <Button
                  className={classes.addButton}
                  variant="light"
                  onClick={() => openContextModal({
                    modal: 'sequenceEmail',
                    title: 'Create email',
                    innerProps: {},
                    fullScreen: matches,
                    styles: { title: { fontSize: 20, fontWeight: 600 } },
                  })}
                >
                  + Add email
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
        <Box mt={8}>
          <Button
            onClick={() => handleAddSequence({ name: 'New sequence', env }, { onSuccess: () => {
              amplitude.track('Sequence created');
            } })}
            variant="light"
            className={classes.addButton}
            style={{ minWidth: matches ? 248 : 304 }}
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
