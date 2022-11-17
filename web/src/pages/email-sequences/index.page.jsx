import { useContext } from 'react';
import { Container, Group, Tabs, Text } from '@mantine/core';

import Pipeline from './components/pipeline';
import SendTestEmailModal from './components/send-test-email-modal';
import TriggerSelectionModal from './components/trigger-selection-modal';
import { EmailSequencesContext, EmailSequencesContextProvider } from './email-sequences-context';
import AddUsersModal from './components/add-users-modal';
import EditEmailModal from './components/edit-email-modal';
import UsersList from './components/users-list';

const EmailSequences = () => {
  const {
    pipelines,
    openedPipeline,
    setOpenedPipeline,
    addEmptyPipeline,
    removePipeline,
  } = useContext(EmailSequencesContext);

  const defaultTab = pipelines[0]?.name;

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
    <Container sx={{ maxWidth: 'fit-content', marginTop: 16 }}>
      <SendTestEmailModal />
      <TriggerSelectionModal />
      <AddUsersModal />
      <EditEmailModal />
      <Tabs defaultValue={defaultTab} value={openedPipeline} onTabChange={handleTabChange}>
        <Tabs.List grow={false}>
          {pipelines.map((pipeline) => (
            <Tabs.Tab key={pipeline.name} value={pipeline.name}>
              <Group position="apart">
                <Text>{pipeline.name}</Text>
              </Group>
            </Tabs.Tab>
          ))}
          <Tabs.Tab value="add-new" onClick={handleCreatePipeline}>
            <Text color="blue">Add pipeline</Text>
          </Tabs.Tab>
          <Tabs.Tab value="remove-current" onClick={removePipeline}>
            <Text color="red">Remove pipeline</Text>
          </Tabs.Tab>
          <Tabs.Tab value="users" ml="auto">
            <Text>Users</Text>
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
