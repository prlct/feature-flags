import {
  UnstyledButton,
  Stack,
  Group,
  Select,
  TextInput,
  CopyButton,
  Button,
  Switch,
  Text,
  Checkbox,
  NumberInput,
} from '@mantine/core';
import { useState } from 'react';
import { IconCopy } from '@tabler/icons';
import { useAddSequence, useUpdateSequenceTrigger } from 'resources/email-sequence/email-sequence.api';

const DEFAULT_EVENTS = [
  {
    label: 'User sign up',
    value: 'user-sign-up',
  },
];

const TriggerSelectionModal = ({ context, id, innerProps }) => {
  const { sequence, pipelineId } = innerProps;
  const [triggerName, setTriggerName] = useState(sequence?.trigger?.name ?? '');
  const [events, setEvents] = useState(DEFAULT_EVENTS);

  const [selectedEvent, setSelectedEvent] = useState(events[0].value);

  const [webhooksShown, setWebhooksShown] = useState(false);
  const [triggerDescription, setTriggerDescription] = useState(sequence?.trigger?.description ?? '');
  const [allowRepeat, setAllowRepeat] = useState(sequence?.trigger?.allowRepeat ?? false);
  const [repeatDelay, setRepeatDelay] = useState(sequence?.trigger?.repeatDelay ?? 0);

  const startURL = `${selectedEvent}/start`;
  const stopURL = `${selectedEvent}/stop`;

  const updateSequenceTrigger = useUpdateSequenceTrigger(sequence?._id).mutate;
  const createSequence = useAddSequence(pipelineId).mutate;

  const handleTriggerSave = () => {
    const data = {
      allowRepeat,
      repeatDelay,
      name: triggerName,
      eventKey: selectedEvent,
      description: triggerDescription,
    };
    if (sequence?._id) {
      updateSequenceTrigger(data);
    } else {
      createSequence({ name: 'new sequence', trigger: data });
    }

    context.closeModal(id);
  };

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
          <Group>
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
          </Group>
        )}
        <Checkbox checked={allowRepeat} onChange={(e) => setAllowRepeat(e.currentTarget.checked)} label="Allow users to repeat workflow" pt={16} />
        {allowRepeat && (
          <NumberInput
            name="repeat delay"
            label="days to repeat workflow"
            value={repeatDelay}
            onChange={setRepeatDelay}
            min={0}
          />
        )}
        <Group position="apart">
          <Button variant="subtle" onClick={() => context.closeModal(id)}>
            Cancel
          </Button>
          <Button onClick={handleTriggerSave}>
            Save
          </Button>
        </Group>
      </Stack>
    </>
  );
};

export default TriggerSelectionModal;
