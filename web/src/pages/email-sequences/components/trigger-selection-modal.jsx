import { UnstyledButton, Stack, Group, Select, TextInput, CopyButton, Button, Switch, Text } from '@mantine/core';
import { useState } from 'react';
import { IconCopy } from '@tabler/icons';

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

const TriggerSelectionModal = ({ context, id, innerProps }) => {
  const [triggerName, setTriggerName] = useState('');
  const [events, setEvents] = useState(DEFAULT_EVENTS);

  const [selectedEvent, setSelectedEvent] = useState(events[0].value);

  const [webhooksShown, setWebhooksShown] = useState(false);
  const [triggerDescription, setTriggerDescription] = useState('');

  const startURL = `${selectedEvent}/start`;
  const stopURL = `${selectedEvent}/stop`;

  return (
    <>
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
          <Button variant="subtle" onClick={() => context.closeModal(id)}>
            Cancel
          </Button>
          <Button>
            Save
          </Button>
        </Group>
      </Stack>
    </>
  );
};

export default TriggerSelectionModal;
