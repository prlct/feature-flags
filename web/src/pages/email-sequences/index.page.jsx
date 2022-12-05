import { Container, Tabs, Text } from '@mantine/core';

import Pipeline from './components/pipeline';
import SendTestEmailModal from './components/send-test-email-modal';
import TriggerSelectionModal from './components/trigger-selection-modal';
import AddUsersModal from './components/add-users-modal';
import EditEmailModal from './components/edit-email-modal';
import UsersList from './components/users-list';

import { useStyles } from './styles';
import { useState } from 'react';
import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';
import { useLocalStorage } from '@mantine/hooks';
import { ENV, LOCAL_STORAGE_ENV_KEY } from '../../helpers/constants';

const EmailSequences = () => {

  const [openedPipeline, setOpenedPipeline] = useState(null);

  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });

  const { data, refetch, isRefetching, isLoading  } = emailSequencesApi.useGetPipelines();
  console.log(data);
  const pipelines = [];
  const defaultTab = null;

  const { classes } = useStyles();


  const handleTabChange = (newTabName) => {
    if (['add-new', 'remove-current'].includes(newTabName)) {
      return;
    }
    setOpenedPipeline(newTabName);
  };

  const handleAddPipeline = emailSequencesApi.useAddPipeline(env);

  return (
    <Container sx={{ maxWidth: 'fit-content', marginTop: 16 }} ml={0} p={0}>
      <SendTestEmailModal />
      <TriggerSelectionModal />
      <AddUsersModal />
      <EditEmailModal />
      <Tabs defaultValue={defaultTab} value={openedPipeline} onTabChange={handleTabChange} variant="pills">
        <Tabs.List grow={false} className={classes.tabPanel} style={{ width: 'calc(100% - 120px)' }}>
          {pipelines.map((pipeline) => (
            <Tabs.Tab key={pipeline.name} value={pipeline.name} className={classes.tabItem}>
              <Text>{pipeline.name}</Text>
            </Tabs.Tab>
          ))}
          <Tabs.Tab value="add-new" onClick={handleAddPipeline} className={classes.tabItem}>
            <Text>+ New pipeline</Text>
          </Tabs.Tab>
          <Tabs.Tab value="remove-current" onClick={undefined} className={classes.tabItem} style={{ position: 'absolute', right: 0 }}>
            <Text>Delete pipeline</Text>
          </Tabs.Tab>
        </Tabs.List>
        {pipelines.map((pipeline) => (
          <Tabs.Panel key={pipeline.name} value={pipeline.name}>
            <Pipeline sequences={pipeline.sequences} />
          </Tabs.Panel>
        ))}
        <Tabs.Panel value="users">
          <UsersList />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};


export default EmailSequences;
