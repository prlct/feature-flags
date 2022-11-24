import { useContext } from 'react';
import { Container, Tabs, Text } from '@mantine/core';

import Pipeline from './components/pipeline';
import SendTestEmailModal from './components/send-test-email-modal';
import TriggerSelectionModal from './components/trigger-selection-modal';
import { EmailSequencesContext, EmailSequencesContextProvider } from './email-sequences-context';
import AddUsersModal from './components/add-users-modal';
import EditEmailModal from './components/edit-email-modal';
import UsersList from './components/users-list';

import { useStyles } from './styles';

const EmailSequences = () => {
  const {
    pipelines,
    openedPipeline,
    setOpenedPipeline,
    addEmptyPipeline,
    removePipeline,
  } = useContext(EmailSequencesContext);

  const defaultTab = pipelines[0]?.name;

  const { classes } = useStyles();

  const handleCreatePipeline = () => {
    const newPipelineName = `Pipeline ${(pipelines.length + 1)}`;
    addEmptyPipeline();
    setOpenedPipeline(newPipelineName);
  };

  const handleTabChange = (newTabName) => {
    if (['add-new', 'remove-current'].includes(newTabName)) {
      return;
    }
    setOpenedPipeline(newTabName);
  };

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
          <Tabs.Tab value="add-new" onClick={handleCreatePipeline} className={classes.tabItem}>
            <Text>+ New pipeline</Text>
          </Tabs.Tab>
          {/* <Tabs.Tab value="users" ml="auto"> */}
          {/*  <Text>Users</Text> */}
          {/* </Tabs.Tab> */}
          <Tabs.Tab value="remove-current" onClick={removePipeline} className={classes.tabItem} style={{ position: 'absolute', right: 0 }}>
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

const WithProvider = () => (
  <EmailSequencesContextProvider>
    <EmailSequences />
  </EmailSequencesContextProvider>
);

export default WithProvider;
