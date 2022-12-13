import { useState } from 'react';
import PropTypes from 'prop-types';
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
  Box,
} from '@mantine/core';
import { IconCopy, IconPlus } from '@tabler/icons';

import { useAddSequence, useUpdateSequenceTrigger, useGetApplicationEvents, useAddApplicationEvent } from 'resources/email-sequence/email-sequence.api';

const TriggerSelectionModal = ({ context, id, innerProps }) => {
  const { sequence, pipelineId } = innerProps;
  const [triggerName, setTriggerName] = useState(sequence?.trigger?.name ?? '');
  const { data: fetchedEvents } = useGetApplicationEvents();
  const createApplicationEvent = useAddApplicationEvent().mutate;

  const events = fetchedEvents?.events || [];

  const [selectedEvent, setSelectedEvent] = useState(
    sequence?.trigger?.eventKey || events?.[0]?.value,
  );
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [creatingEventName, setCreatingEventName] = useState('');
  const [creatingEventKey, setCreatingEventKey] = useState('');

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

  const saveEvent = () => {
    createApplicationEvent({ label: creatingEventName, value: creatingEventKey }, {
      onSuccess: () => {

      },
    });
    setCreatingEvent(false);
  };

  return (
    <>
      <Select
        label="Select an event"
        data={events}
        placeholder="Select event"
        value={selectedEvent}
        onChange={setSelectedEvent}
      />
      <UnstyledButton onClick={() => setCreatingEvent((prev) => !prev)}>
        <Group spacing={0}>
          <IconPlus color="#734ab7" />
          <Text color="primary">Add new event</Text>
        </Group>
      </UnstyledButton>
      {creatingEvent && (
        <Stack spacing={0} m="0 16px 16px 16px">
          <TextInput label="Event name" value={creatingEventName} onChange={(e) => setCreatingEventName(e.target.value)} />
          <TextInput label="Event key" value={creatingEventKey} onChange={(e) => setCreatingEventKey(e.target.value)} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button mt={4} onClick={saveEvent} styles={{ maxWidth: '80px' }}>Save</Button>
          </Box>
        </Stack>
      )}

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

TriggerSelectionModal.propTypes = {
  context: PropTypes.shape({
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    pipelineId: PropTypes.string,
    sequence: PropTypes.shape({
      _id: PropTypes.string,
      trigger: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
        allowRepeat: PropTypes.string,
        repeatDelay: PropTypes.number,
        eventKey: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default TriggerSelectionModal;
