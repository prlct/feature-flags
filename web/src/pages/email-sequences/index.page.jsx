import { useState } from 'react';

import { Container, Tabs, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';

import Pipeline from './components/pipeline';

import { useStyles } from './styles';
import PipelineTab from './components/pipeline-tab';

const EmailSequences = () => {
  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });
  const {
    data,
    refetch,
    isRefetching,
    isLoading,
  } = emailSequencesApi.useGetPipelines(env);
  const pipelines = data?.results || [];
  const [openedPipeline, setOpenedPipeline] = useState(pipelines?.[0] || null);

  const defaultTab = pipelines?.[0] || null;

  const { classes } = useStyles();

  const handleTabChange = (newTabName) => {
    if (['add-new', 'remove-current'].includes(newTabName)) {
      return;
    }
    setOpenedPipeline(newTabName);
  };

  const handleAddPipeline = emailSequencesApi.useAddPipeline(env).mutate;
  const handleRemovePipeline = emailSequencesApi.useRemovePipeline().mutate;

  return (
    <Container sx={{ maxWidth: 'fit-content', marginTop: 16 }} ml={0} p={0}>
      <Tabs
        defaultValue={defaultTab}
        value={openedPipeline}
        onTabChange={handleTabChange}
        variant="pills"
        keepMounted={false}
      >
        <Tabs.List grow={false} className={classes.tabPanel} style={{ width: 'calc(100% - 120px)' }}>
          {pipelines.map((pipeline) => (
            <PipelineTab key={pipeline._id} pipeline={pipeline} />
          ))}
          <Tabs.Tab value="add-new" onClick={handleAddPipeline} className={classes.tabItem}>
            <Text>+ New pipeline</Text>
          </Tabs.Tab>
          <Tabs.Tab
            value="remove-current"
            onClick={() => handleRemovePipeline(openedPipeline)}
            className={classes.tabItem}
            style={{ position: 'absolute', right: 0 }}
          >
            <Text>Delete pipeline</Text>
          </Tabs.Tab>
        </Tabs.List>
        {pipelines.map((pipeline) => (
          <Tabs.Panel key={pipeline._id} value={pipeline._id}>
            <Pipeline id={pipeline._id} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Container>
  );
};

export default EmailSequences;
