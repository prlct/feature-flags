import { useCallback, useEffect, useState } from 'react';
import { Tabs, Text, TextInput } from '@mantine/core';
import PropTypes from 'prop-types';

import queryClient from 'query-client';

import * as emailSequenceApi from 'resources/email-sequence/email-sequence.api';

import { useStyles } from '../styles';

const PipelineTab = ({ pipeline }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [pipelineName, setPipelineName] = useState(pipeline.name);

  const { mutate: renamePipeline } = emailSequenceApi.useUpdatePipeline();

  const { classes } = useStyles();

  const saveName = useCallback(() => {
    if (!pipelineName || pipelineName === pipeline.name) {
      setIsEditMode(false);
      setPipelineName(pipeline.name);
      return;
    }
    renamePipeline({ _id: pipeline._id, name: pipelineName }, {
      onSuccess: (data) => {
        setIsEditMode(false);
        setPipelineName(data.name);
        queryClient.invalidateQueries(['/pipelines']);
      },
    });
  }, [pipeline._id, pipeline.name, pipelineName, renamePipeline]);

  const openInput = useCallback(() => {
    setIsEditMode(true);
  }, []);

  useEffect(() => {
    setPipelineName(pipeline.name);
  }, [pipeline]);

  return (
    <Tabs.Tab key={pipeline._id} value={pipeline._id} className={classes.tabItem}>
      {isEditMode
        ? (
          <TextInput
            value={pipelineName}
            onChange={(e) => setPipelineName(e.currentTarget.value)}
            onKeyUp={(event) => event.key === 'Enter' && saveName()}
            onBlur={saveName}
            variant="unstyled"
            autoFocus
          />
        )
        : <Text onDoubleClick={openInput}>{pipelineName}</Text>}
    </Tabs.Tab>
  );
};

PipelineTab.propTypes = {
  pipeline: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default PipelineTab;
