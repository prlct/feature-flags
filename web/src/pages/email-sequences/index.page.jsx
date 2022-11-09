import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Tabs, Text } from '@mantine/core';

import Pipeline from './components/pipeline';
import SendTestEmailModal from './components/send-test-email-modal';
import TriggerSelectionModal from './components/trigger-selection-modal';
import { EmailSequencesContextProvider, EXAMPLE_PIPELINES } from './email-sequences-context';

const EmailSequences = () => {
  const router = useRouter();

  const [pipelines, setPipelines] = useState(EXAMPLE_PIPELINES);
  const [openedPipeline, setOpenedPipeline] = useState(router.asPath.split('#')?.[1] || pipelines[0]?.name);

  const defaultTab = pipelines[0]?.name;

  const handleCreatePipeline = () => {
    const newPipelineName = `Pipeline ${(pipelines.length + 1)}`;
    setPipelines((prev) => [...prev, {
      name: newPipelineName,
      sequences: [],
    }]);
    setOpenedPipeline(newPipelineName);
  };

  return (
    <EmailSequencesContextProvider>
      <Container sx={{ maxWidth: 'fit-content' }}>
        <SendTestEmailModal />
        <TriggerSelectionModal />
        <Tabs defaultValue={defaultTab} value={openedPipeline} onTabChange={setOpenedPipeline}>
          <Tabs.List grow={false}>
            {pipelines.map((pipeline) => (
              <Tabs.Tab key={pipeline.name} value={pipeline.name}>
                {pipeline.name}
              </Tabs.Tab>
            ))}
            <Tabs.Tab value="add-new" onClick={handleCreatePipeline}>
              <Text color="blue">Add pipeline</Text>
            </Tabs.Tab>
          </Tabs.List>
          {pipelines.map((pipeline) => (
            <Tabs.Panel key={pipeline.name} value={pipeline.name}>
              <Pipeline sequences={pipeline.sequences} />
            </Tabs.Panel>
          ))}
        </Tabs>
      </Container>
    </EmailSequencesContextProvider>
  );
};

export default EmailSequences;
