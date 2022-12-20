import { useEffect, useState } from 'react';
import { Tabs, Text } from '@mantine/core';
import PropTypes from 'prop-types';

import { useStyles } from '../styles';

const InactivePipelineTab = ({ pipeline }) => {
  const [pipelineName, setPipelineName] = useState(pipeline.name);

  const { classes } = useStyles();

  useEffect(() => {
    setPipelineName(pipeline.name);
  }, [pipeline]);

  return (
    <Tabs.Tab key={pipeline._id} value={pipeline._id} className={classes.inactiveTabItem}>
      <Text>{pipelineName}</Text>
    </Tabs.Tab>
  );
};

InactivePipelineTab.propTypes = {
  pipeline: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default InactivePipelineTab;
