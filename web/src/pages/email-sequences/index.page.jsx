import { useMemo, useState } from 'react';

import { Container, Group, LoadingOverlay, Tabs, Text, Title, Button } from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';

import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';

import Pipeline from './components/pipeline';

import { useStyles, tabListStyles } from './styles';
import PipelineTab from './components/pipeline-tab';
import InactivePipelineTab from './components/inactive-pipeline-tab';

const EmailSequences = () => {
  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });
  const {
    data,
    isLoading,
    isFetching,
  } = emailSequencesApi.useGetPipelines(env);

  const pipelines = useMemo(() => data?.results || [], [data]);
  const [openedPipeline, setOpenedPipeline] = useState(pipelines?.[0]?._id || 'activation-pipelines');
  const [openedPipelineName, setOpenedPipelineName] = useState(pipelines?.[0]?.name || '');

  const defaultTab = pipelines?.[0] || null;

  const { classes } = useStyles();
  const matches = useMediaQuery('(max-width: 768px)');

  const handleTabChange = (newTabName) => {
    if (['add-new', 'remove-current'].includes(newTabName)) {
      return;
    }
    setOpenedPipeline(newTabName);
    setOpenedPipelineName(pipelines?.filter((pipeline) => (
      pipeline._id === newTabName))[0]?.name);
  };

  const {
    mutate: handleAddPipeline,
    isLoading: isCreateInProgress,
  } = emailSequencesApi.useAddPipeline(env);

  const {
    isLoading: isRemoveInProgress,
    mutate: handleRemovePipeline,
  } = emailSequencesApi.useRemovePipeline();

  const isLoaderVisible = isCreateInProgress || isRemoveInProgress || isLoading || isFetching;

  if (openedPipeline === 'activation-pipelines') {
    return (
      <Container sx={{ marginTop: 16, maxWidth: '100%' }} ml={0} p={0}>
        <LoadingOverlay visible={isLoaderVisible} overlayBlur={2} />

        <Group className={classes.headerGroup}>
          <Title order={2}>Activation pipelines</Title>
          <Button
            className={classes.addButton}
            variant="light"
            onClick={handleAddPipeline}
          >
            + Add pipeline
          </Button>
        </Group>

        <Tabs
          defaultValue={defaultTab}
          value={openedPipeline}
          onTabChange={handleTabChange}
          variant="pills"
          keepMounted={false}
          sx={{ position: 'relative' }}
        >
          <Tabs.List
            grow={false}
            className={classes.tabPanel}
            sx={(theme) => tabListStyles(theme, openedPipeline)}
          >
            {pipelines.map((pipeline) => (
              <InactivePipelineTab key={pipeline._id} pipeline={pipeline} />
            ))}
          </Tabs.List>

          {pipelines.map((pipeline) => (
            <Tabs.Panel key={pipeline._id} value={pipeline._id}>
              <Pipeline id={pipeline._id} />
            </Tabs.Panel>
          ))}
        </Tabs>
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: 16, maxWidth: '100%' }} ml={0} p={0}>
      <LoadingOverlay visible={isLoaderVisible} overlayBlur={2} />
      <Tabs
        defaultValue={defaultTab}
        value={openedPipeline}
        onTabChange={handleTabChange}
        variant="pills"
        keepMounted={false}
        sx={{ position: 'relative' }}
      >
        <Tabs.List
          grow={false}
          className={classes.tabPanel}
          sx={(theme) => tabListStyles(theme, openedPipeline)}
          style={{ width: matches && '100%' }}
        >
          {matches ? (
            <Tabs.Tab value="activation-pipelines" className={classes.tabItem}>
              <Text sx={{ fontSize: 14, color: 'black', textDecoration: 'underline' }}>All pipelines </Text>
              <Text sx={{ fontSize: 14, color: 'black', paddingLeft: 3 }}>/</Text>
              <Text sx={{ fontSize: 14, color: '#797C80', width: '100%', paddingLeft: 3 }}>
                {openedPipelineName}
              </Text>
            </Tabs.Tab>
          ) : (
            <>
              <Tabs.Tab value="activation-pipelines" className={classes.tabItem}>
                <Text>All pipelines</Text>
              </Tabs.Tab>
              {pipelines.map((pipeline) => (
                <PipelineTab key={pipeline._id} pipeline={pipeline} />
              ))}
            </>
          )}

        </Tabs.List>
        <Tabs.Tab
          value="remove-current"
          onClick={() => handleRemovePipeline(openedPipeline)}
          className={classes.tabItem}
          style={{ position: 'absolute', right: 0, top: 0 }}
        >
          <Text>Delete pipeline</Text>
        </Tabs.Tab>
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
