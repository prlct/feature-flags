import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Container, Tabs, Text, Title } from '@mantine/core';

import { emailSequenceApi } from 'resources/email-sequence';
import { useLocalStorage } from '@mantine/hooks';
import queryClient from 'query-client';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';
import { useModals } from '@mantine/modals';
import Pipeline from './components/pipeline';
import SendTestEmailModal from './components/send-test-email-modal';
import TriggerSelectionModal from './components/trigger-selection-modal';
import { EmailSequencesContextProvider, EXAMPLE_PIPELINES } from './email-sequences-context';
import AddUsersModal from './components/add-users-modal';
import EditEmailModal from './components/edit-email-modal';
import UsersList from './components/users-list';

import PipelineTab from './components/pipeline-tab';
import RenameSequenceModal from './components/rename-sequence-modal';

import { useStyles } from './styles';

const EmailSequences = () => {
  const modals = useModals();

  const [pipelines, setPipelines] = useState(null);
  const [currentTab, setCurrentTab] = useState('');

  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });

  const { mutate: createPipeline } = emailSequenceApi.useAddPipeline();
  const { data: fetchedPipelines, isFetching } = emailSequenceApi.useGetPipelines({ env });
  const { mutate: removePipeline } = emailSequenceApi.useRemovePipeline();

  const { classes } = useStyles();

  const handleCreatePipeline = useCallback(() => {
    createPipeline(
      {
        index: pipelines.length + 1,
        env,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['pipelines', { env }]);
        },
      },
    );
  }, [createPipeline, env, pipelines?.length]);

  const handleTabChange = (value) => {
    const currentPipeline = pipelines.find((pl) => pl._id === value);

    if (['add-new', 'remove-current'].includes(value)) {
      return;
    }
    queryClient.setQueryData(['currentPipeline'], currentPipeline);
    setCurrentTab(value);
  };

  const handleRemovePipeline = useMemo(() => () => {
    const openedPipeline = queryClient.getQueryData(['currentPipeline']);
    modals.openConfirmModal({
      title: (<Title order={3}>{`Delete pipeline ${openedPipeline.name}`}</Title>),
      centered: true,
      children: (
        <Text>
          {`Delete pipeline ${openedPipeline.name}?`}
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'subtle' },
      cancelProps: { variant: 'subtle' },
      onConfirm: () => {
        removePipeline(openedPipeline._id, {
          onSuccess: () => {
            queryClient.invalidateQueries('pipelines');
          },
        });
      },
    });
  }, [modals, removePipeline]);

  useEffect(() => {
    if (fetchedPipelines?.results.length) {
      setPipelines(fetchedPipelines.results);
      setCurrentTab(fetchedPipelines.results[0]._id);
      return;
    }

    if (!isFetching) {
      setPipelines(EXAMPLE_PIPELINES);
      setCurrentTab(EXAMPLE_PIPELINES[0].id);
    }
  }, [fetchedPipelines, env, isFetching]);

  useEffect(() => {
    if (pipelines) {
      queryClient.setQueryData(['currentPipeline'], pipelines[0]);
    }
  }, [pipelines]);

  return (
    <Container sx={{ marginTop: 16 }} ml={0} p={0}>
      <SendTestEmailModal />
      <TriggerSelectionModal />
      <AddUsersModal />
      <EditEmailModal />
      <RenameSequenceModal />
      <Tabs value={currentTab} onTabChange={handleTabChange} variant="pills">
        <Tabs.List grow={false} className={classes.tabPanel} style={{ width: 'calc(100% - 120px)' }}>
          {pipelines?.map((pipeline) => (
            <PipelineTab pipeline={pipeline} />
          ))}
          <Tabs.Tab value="add-new" onClick={handleCreatePipeline} className={classes.tabItem}>
            <Text>+ New pipeline</Text>
          </Tabs.Tab>
          {/* <Tabs.Tab value="users" ml="auto"> */}
          {/*  <Text>Users</Text> */}
          {/* </Tabs.Tab> */}
          <Tabs.Tab value="remove-current" onClick={handleRemovePipeline} className={classes.tabItem} style={{ position: 'absolute', right: 0 }}>
            <Text>Delete pipeline</Text>
          </Tabs.Tab>
        </Tabs.List>
        {pipelines?.map((pipeline) => (
          <Tabs.Panel key={pipeline.name} value={pipeline._id} id={pipeline._id}>
            <Pipeline />
          </Tabs.Panel>
        ))}
        <Tabs.Panel value="users">
          <UsersList />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

const WithProvider = () => (
  <EmailSequencesContextProvider>
    <EmailSequences />
  </EmailSequencesContextProvider>
);

export default WithProvider;
