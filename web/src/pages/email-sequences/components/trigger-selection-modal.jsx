import { UnstyledButton, Stack, Group, Modal, Select, TextInput, CopyButton, Button, Switch, Text } from '@mantine/core';
import { useContext, useState } from 'react';
import { IconCopy } from '@tabler/icons';
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
    setTrigger,
    currentSequence,
    addSequence,
  } = useContext(EmailSequencesContext);

  const [triggerName, setTriggerName] = useState('');
  const [events, setEvents] = useState(DEFAULT_EVENTS);

  const currentEvent = currentSequence?.trigger.value || null;

  const [selectedEvent, setSelectedEvent] = useState(currentEvent || events[0].value);

  const [webhooksShown, setWebhooksShown] = useState(false);
  const [triggerDescription, setTriggerDescription] = useState('');

  const startURL = `${selectedEvent}/start`;
  const stopURL = `${selectedEvent}/stop`;

  const onSave = () => {
    if (!currentSequence) {
      const trigger = createTrigger(triggerName);
      addSequence(trigger);
    } else {
      setTrigger(
        {
          ...currentSequence.trigger,
          name: triggerName,
          description: triggerDescription,
          value: selectedEvent,
        },
      );
    }
    closeTriggerModal();
  };

  return (
    <Modal
      opened={triggerSelectionModal}
      onClose={closeTriggerModal}
      title="Choose trigger"
      withCloseButton={false}
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
