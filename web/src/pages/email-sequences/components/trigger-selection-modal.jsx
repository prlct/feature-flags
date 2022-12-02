import { UnstyledButton, Stack, Group, Modal, Select, TextInput, CopyButton, Button, Switch, Text } from '@mantine/core';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { IconCopy } from '@tabler/icons';

import queryClient from 'query-client';

import { emailSequenceApi } from 'resources/email-sequence';
import { EmailSequencesContext } from '../email-sequences-context';

const createTrigger = (name) => ({
  id: `${Math.random() * 10000}`,
  name,
  description: '',
  applicationId: '1',
});

const DEFAULT_EVENTS = [
  {
    label: 'User sign up',
    value: 'user-sign-up',
  },
  {
    label: 'User creates feature flag',
    value: 'user-creates-feature-flag',
  },
];

const TriggerSelectionModal = () => {
  const {
    triggerSelectionModal,
    closeTriggerModal,
  } = useContext(EmailSequencesContext);

  const currentSequence = queryClient.getQueryData('currentSequence');
  const currentPipeline = queryClient.getQueryData('currentPipeline');

  const { mutate: createSequence } = emailSequenceApi.useAddSequence();
  const { mutate: updateSequence } = emailSequenceApi.useUpdateSequence();

  const [triggerName, setTriggerName] = useState(currentSequence?.trigger?.name || '');
  const [events, setEvents] = useState(DEFAULT_EVENTS);

  const currentEvent = currentSequence?.trigger?.value || null;

  const [selectedEvent, setSelectedEvent] = useState(currentEvent || events[0].value);

  const [webhooksShown, setWebhooksShown] = useState(false);
  const [triggerDescription, setTriggerDescription] = useState(currentSequence?.trigger?.description || '');

  useEffect(() => {
    if (currentSequence?.trigger) {
      setTriggerName(currentSequence.trigger.name);
      setTriggerDescription(currentSequence.trigger.description);
    } else {
      setTriggerDescription('');
      setTriggerName('');
    }
  }, [currentSequence]);

  const startURL = `${selectedEvent}/start`;
  const stopURL = `${selectedEvent}/stop`;

  const addSequence = useMemo(() => (trigger) => {
    createSequence(
      {
        pipelineId: currentPipeline._id,
        name: 'New Sequence',
        trigger: { ...trigger, key: new Date().toString() } },
    );
  }, [createSequence, currentPipeline?._id]);

  const updateTrigger = useCallback((trigger) => {
    updateSequence({
      _id: currentSequence._id,
      trigger: { ...trigger, key: new Date().toString() },
    });
  }, [currentSequence?._id, updateSequence]);

  const onSave = () => {
    if (!currentSequence._id) {
      const trigger = createTrigger(triggerName);
      addSequence(trigger);
    } else {
      const trigger = createTrigger(triggerName);
      updateTrigger(trigger);
    }
    closeTriggerModal();
  };

  return (
    <Modal
      opened={triggerSelectionModal}
      onClose={closeTriggerModal}
      title="Choose trigger"
      withCloseButton
      centered
    >

      <Select
        label="Select an event"
        data={events}
        placeholder="Select event"
        creatable
        searchable
        value={selectedEvent}
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query };
          setEvents((current) => [...current, item]);
          return item;
        }}
        onChange={setSelectedEvent}
      />

      <TextInput label="Trigger name" value={triggerName} onChange={(e) => setTriggerName(e.target.value)} />
      <TextInput label="Trigger description" value={triggerDescription} onChange={(e) => setTriggerDescription(e.target.value)} />
      <Switch label="Add webhook triggers" checked={webhooksShown} onChange={(e) => setWebhooksShown(e.currentTarget.checked)} />
      <Stack>
        {webhooksShown && (
          <Stack>
            <Text>
              Authorized POST requests with firstName,
              lastName, email parameters can trigger sequence start/stop
            </Text>
            <Group>
              <TextInput label="Start webhook" value={startURL} readOnly />
              <CopyButton value={startURL}>
                {({ copy }) => (
                  <UnstyledButton onClick={copy}>
                    <IconCopy />
                  </UnstyledButton>
                )}
              </CopyButton>
            </Group>
            <Group>
              <TextInput label="Stop webhook" value={stopURL} readOnly />
              <CopyButton value={stopURL}>
                {({ copy }) => (
                  <UnstyledButton onClick={copy}>
                    <IconCopy />
                  </UnstyledButton>
                )}
              </CopyButton>
            </Group>
          </Stack>
        )}
        <Group position="apart">
          <Button variant="subtle" onClick={closeTriggerModal}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default TriggerSelectionModal;
