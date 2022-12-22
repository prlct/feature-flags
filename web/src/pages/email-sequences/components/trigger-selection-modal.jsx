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
  NumberInput,
  Box, Code,
} from '@mantine/core';
import { IconCopy, IconPlus } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';

import config from 'config';
import {
  useAddSequence,
  useUpdateSequenceTrigger,
  useGetApplicationEvents,
  useAddApplicationEvent,
  useGetSenderEmails,
} from 'resources/email-sequence/email-sequence.api';

const TriggerSelectionModal = ({ context, id, innerProps }) => {
  const { sequence, pipelineId } = innerProps;
  const [triggerName, setTriggerName] = useState(sequence?.trigger?.name ?? '');
  const { data: fetchedEvents } = useGetApplicationEvents();
  const {
    mutate: createApplicationEvent,
    isLoading,
    error: eventCreationError,
  } = useAddApplicationEvent();

  const events = fetchedEvents?.events || [];

  const [selectedEvent, setSelectedEvent] = useState(
    sequence?.trigger?.eventKey || events?.[0]?.value,
  );
  const [selectedStopEvent, setSelectedStopEvent] = useState(
    sequence?.trigger?.stopEventKey || events?.filter((e) => e.value !== selectedEvent)?.[0]?.value,
  );

  const { data: senderEmails = [] } = useGetSenderEmails();

  const [selectedSenderEmail, setSelectedSenderEmail] = useState(
    sequence?.trigger?.senderEmail
    || senderEmails?.filter((e) => e.value !== selectedSenderEmail)?.[0],
  );

  const [creatingEvent, setCreatingEvent] = useState(false);
  const [creatingEventName, setCreatingEventName] = useState('');
  const [creatingEventKey, setCreatingEventKey] = useState('');

  const [webhooksShown, setWebhooksShown] = useState(false);
  const [triggerDescription, setTriggerDescription] = useState(sequence?.trigger?.description ?? '');
  const [allowMoveToNextSequence, setAllowMoveToNextSequence] = useState(
    sequence?.trigger?.allowMoveToNextSequence ?? false,
  );
  const [allowRepeat, setAllowRepeat] = useState(sequence?.trigger?.allowRepeat ?? false);
  const [repeatDelay, setRepeatDelay] = useState(sequence?.trigger?.repeatDelay ?? 0);

  const startURL = `${config.apiUrl}/sequences/webhook/start/${selectedEvent}`;
  const stopURL = `${config.apiUrl}/sequences/webhook/stop/${selectedEvent}`;

  const {
    mutate: updateSequenceTrigger,
    error: updateError,
  } = useUpdateSequenceTrigger(sequence?._id);
  const { mutate: createSequence, error: createError } = useAddSequence(pipelineId);

  const errors = updateError?.data?.errors || createError?.data?.errors;

  const handleTriggerSave = async () => {
    const data = {
      allowRepeat,
      repeatDelay,
      name: triggerName,
      eventKey: selectedEvent,
      stopEventKey: selectedStopEvent,
      description: triggerDescription,
      allowMoveToNextSequence,
      senderEmail: selectedSenderEmail,
    };
    if (sequence?._id) {
      await updateSequenceTrigger(data, {
        onSuccess: () => {
          context.closeModal(id);
        },
      });
    } else {
      await createSequence({ name: 'new sequence', trigger: data }, {
        onSuccess: () => {
          context.closeModal(id);
        },
      });
    }
  };

  const saveEvent = () => {
    createApplicationEvent({ label: creatingEventName, value: creatingEventKey }, {
      onSuccess: () => {
        setCreatingEvent(false);
        showNotification({
          title: 'Trigger event created',
          message: 'Trigger event created',
          color: 'green',
        });
      },
    });
  };

  const handleEventNameChange = (name) => {
    setCreatingEventName(name);
    setCreatingEventKey(name.toLowerCase().replaceAll(' ', '-'));
  };

  return (
    <>
      <Select
        data={senderEmails}
        label="Email original"
        value={selectedSenderEmail}
        onChange={setSelectedSenderEmail}
        error={errors?.['trigger.senderEmail']}
      />
      <TextInput
        error={errors?.['trigger.name']}
        label="Trigger name"
        value={triggerName}
        onChange={(e) => setTriggerName(e.target.value)}
      />
      <TextInput
        label="Trigger description"
        value={triggerDescription}
        onChange={(e) => setTriggerDescription(e.target.value)}
        error={errors?.['trigger.description']}
      />
      <Stack spacing={0}>
        <Select
          label="Select an event to start the sequence"
          data={events}
          placeholder="Select event"
          value={selectedEvent}
          onChange={setSelectedEvent}
        />
        <Text size="sm">
          eventKey:&nbsp;
          <Code size="sm" component="span">
            {events?.find((e) => e.value === selectedEvent)?.value}
          </Code>
        </Text>
      </Stack>
      <Stack spacing={0}>
        <Select
          label="Select an event to stop the sequence"
          data={events.filter((e) => e.value !== selectedEvent)}
          placeholder="Select event"
          value={selectedStopEvent}
          onChange={setSelectedStopEvent}
        />
        <Text size="sm">
          eventKey:&nbsp;
          <Code size="sm" component="span">
            {events?.find((e) => e.value === selectedStopEvent)?.value}
          </Code>
        </Text>
      </Stack>
      <UnstyledButton onClick={() => setCreatingEvent((prev) => !prev)}>
        <Group spacing={0}>
          <IconPlus color="#734ab7" />
          <Text color="primary">Add new event</Text>
        </Group>
      </UnstyledButton>
      {creatingEvent && (
        <Stack spacing={0} m="0 16px 16px 16px">
          <TextInput
            label="Event name"
            value={creatingEventName}
            onChange={(e) => handleEventNameChange(e.target.value)}
            error={eventCreationError?.data?.errors?.label}
          />
          <TextInput
            label="Event key"
            value={creatingEventKey}
            onChange={(e) => setCreatingEventKey(e.target.value)}
            error={eventCreationError?.data?.errors?.value}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button mt={4} onClick={saveEvent} styles={{ maxWidth: '80px' }} disabled={isLoading}>Save</Button>
          </Box>
        </Stack>
      )}

      <Switch label="Move user to next sequence after last email sent" checked={allowMoveToNextSequence} onChange={(e) => setAllowMoveToNextSequence(e.currentTarget.checked)} />
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
        <Switch checked={allowRepeat} onChange={(e) => setAllowRepeat(e.currentTarget.checked)} label="Allow subscribers to repeat workflow" pt={16} />
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
        senderEmail: PropTypes.string,
        description: PropTypes.string,
        allowRepeat: PropTypes.string,
        repeatDelay: PropTypes.number,
        eventKey: PropTypes.string,
        stopEventKey: PropTypes.string,
        allowMoveToNextSequence: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default TriggerSelectionModal;
