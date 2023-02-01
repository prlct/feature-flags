import { useEffect, useMemo, useState } from 'react';
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
  Textarea,
} from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { IconCopy } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import * as routes from 'routes';

import config from 'config';
import {
  useAddSequence,
  useUpdateSequenceTrigger,
  useGetApplicationEvents,
  useAddApplicationEvent,
  useGetSenderEmails,
} from 'resources/email-sequence/email-sequence.api';
import { Link } from 'components';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';
import { useAmplitude } from 'contexts/amplitude-context';

const TriggerSelectionModal = ({ context, id, innerProps }) => {
  const { sequence, pipelineId } = innerProps;
  const [triggerName, setTriggerName] = useState(sequence?.trigger?.name ?? '');
  const { data: fetchedEvents } = useGetApplicationEvents();
  const amplitude = useAmplitude();

  const {
    mutate: createApplicationEvent,
    isLoading,
    error: eventCreationError,
  } = useAddApplicationEvent();

  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });

  const matches = useMediaQuery('(max-width: 768px)');

  const events = useMemo(() => fetchedEvents?.events || [], [fetchedEvents]);

  const [selectedEvent, setSelectedEvent] = useState(
    sequence?.trigger?.eventKey,
  );
  const [selectedStopEvent, setSelectedStopEvent] = useState(
    sequence?.trigger?.stopEventKey,
  );

  useEffect(() => {
    if (sequence?.trigger?.eventKey) {
      setSelectedEvent(sequence?.trigger?.eventKey);
    }
  }, [sequence]);

  const { data: senderEmails = [] } = useGetSenderEmails();

  const [selectedSenderEmail, setSelectedSenderEmail] = useState(
    sequence?.trigger?.senderEmail
    || senderEmails?.filter((e) => e.value !== selectedSenderEmail)?.[0],
  );

  const [startEvent, setStartEvent] = useState(false);

  useEffect(() => {
    setStartEvent(!!sequence?.trigger?.eventKey);
  }, [sequence?.trigger?.eventKey]);

  const [stopEvent, setStopEvent] = useState(false);
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
      eventKey: (startEvent && selectedEvent) || null,
      stopEventKey: (stopEvent && selectedStopEvent) || null,
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
      await createSequence({ name: 'new sequence', trigger: data, env }, {
        onSuccess: () => {
          amplitude.track('Trigger added');
          amplitude.track('Sequence created');
          context.closeModal(id);
        },
      });
    }
  };

  const saveEvent = () => {
    createApplicationEvent({ label: creatingEventName, value: creatingEventKey }, {
      onSuccess: () => {
        setCreatingEvent(false);
        amplitude.track('Event created');
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
      <Stack spacing={24}>
        <TextInput
          error={errors?.name}
          label="Trigger name"
          placeholder="Enter trigger name"
          value={triggerName}
          onChange={(e) => setTriggerName(e.target.value)}
        />
        <Textarea
          label="Trigger description"
          placeholder="Enter trigger description"
          value={triggerDescription}
          onChange={(e) => setTriggerDescription(e.target.value)}
          error={errors?.description}
          sx={{ height: 80 }}
        />
        <Box sx={{ padding: '24px 0', borderTop: '1px solid #D4D8DD' }}>
          <Select
            data={senderEmails}
            label="Send emails from"
            placeholder="Select"
            value={selectedSenderEmail}
            onChange={setSelectedSenderEmail}
            error={errors?.senderEmail}
          />
          <UnstyledButton onClick={() => setCreatingEvent((prev) => !prev)}>
            <Group spacing={0} sx={{ paddingTop: 8 }}>
              <UnstyledButton onClick={() => context.closeModal(id)}>
                <Link type="router" href={routes.route.pipelineSettings} underline={false}>
                  <Text color="primary" sx={{ fontWeight: 700 }}>+ Add new email</Text>
                </Link>
              </UnstyledButton>
            </Group>
          </UnstyledButton>
        </Box>
      </Stack>

      <Stack spacing={0} sx={{ borderTop: '1px solid #D4D8DD' }}>
        <Switch
          checked={startEvent}
          onChange={(e) => setStartEvent(e.currentTarget.checked)}
          label="Add start event"
          pt={10}
          pb={25}
          sx={{ lineHeight: '20px' }}
        />

        {startEvent && (
        <>
          <Select
            label="Select an event to start the sequence"
            data={events}
            placeholder="Select"
            value={selectedEvent}
            onChange={setSelectedEvent}
          />
          <Text size="sm">
            eventKey:&nbsp;
            <Code size="sm" component="span">
              {events?.find((e) => e.value === selectedEvent)?.value}
            </Code>
          </Text>
          {creatingEvent ? (
            <Stack spacing={24} p="20px" sx={{ margin: '24px 0', border: '1px solid #D4D8DD', borderRadius: 6 }}>
              <Text>New event</Text>
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                <Button
                  variant="subtle"
                  color="black"
                  mt={4}
                  onClick={() => setCreatingEvent((prev) => !prev)}
                  styles={{ maxWidth: '80px', fontWeight: 600 }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="light"
                  mt={4}
                  onClick={saveEvent}
                  styles={{ maxWidth: '80px' }}
                  disabled={isLoading}
                >
                  Add
                </Button>
              </Box>
            </Stack>
          ) : (
            <UnstyledButton onClick={() => setCreatingEvent((prev) => !prev)}>
              <Group spacing={0} sx={{ paddingBottom: 24 }}>
                <Text color="primary" sx={{ fontWeight: 700 }}>+ Add new event</Text>
              </Group>
            </UnstyledButton>

          )}
        </>
        )}
      </Stack>
      <Stack spacing={0} sx={{ borderTop: '1px solid #D4D8DD' }}>
        <Switch
          checked={stopEvent}
          onChange={(e) => setStopEvent(e.currentTarget.checked)}
          label="Add end event"
          pt={10}
          pb={25}
          sx={{ lineHeight: '20px' }}
        />
        {stopEvent && (
        <>
          <Select
            label="Select the event that ends the sequence"
            data={events.filter((e) => e.value !== selectedEvent)}
            placeholder="Select"
            value={selectedStopEvent}
            onChange={setSelectedStopEvent}
          />
          <Text size="sm">
            eventKey:&nbsp;
            <Code size="sm" component="span">
              {events?.find((e) => e.value === selectedStopEvent)?.value}
            </Code>
          </Text>
          {creatingEvent ? (
            <Stack spacing={24} p="20px" sx={{ margin: '24px 0', border: '1px solid #D4D8DD', borderRadius: 6 }}>
              <Text>New event</Text>
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                <Button
                  variant="subtle"
                  color="black"
                  onClick={() => setCreatingEvent((prev) => !prev)}
                  styles={{ maxWidth: '80px', fontWeight: 600 }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="light"
                  onClick={saveEvent}
                  styles={{ maxWidth: '80px' }}
                  disabled={isLoading}
                >
                  Add
                </Button>
              </Box>
            </Stack>
          ) : (
            <UnstyledButton onClick={() => setCreatingEvent((prev) => !prev)}>
              <Group spacing={0} sx={{ paddingBottom: 24 }}>
                <Text color="primary" sx={{ fontWeight: 700 }}>+ Add new event</Text>
              </Group>
            </UnstyledButton>
          )}
        </>
        )}

      </Stack>

      <Switch
        label="Move user to next sequence after last email sent"
        checked={allowMoveToNextSequence}
        onChange={(e) => setAllowMoveToNextSequence(e.currentTarget.checked)}
        pt={10}
        pb={25}
        sx={{ lineHeight: '20px', borderTop: '1px solid #D4D8DD' }}
      />
      <Switch
        label="Add webhook triggers"
        checked={webhooksShown}
        onChange={(e) => setWebhooksShown(e.currentTarget.checked)}
        pt={10}
        pb={25}
        sx={{ lineHeight: '20px', borderTop: '1px solid #D4D8DD' }}
      />
      <Stack spacing={24}>
        {webhooksShown && (
          <Stack>
            <Text sx={(theme) => ({ fontSize: 14, color: theme.colors.gray[4] })}>
              Authorized POST requests with firstName,
              lastName, email parameters can trigger sequence start/stop
            </Text>
            <Group>
              <Group sx={{ width: matches && '100%' }}>
                <TextInput
                  label="Start webhook"
                  value={startURL}
                  readOnly
                  rightSection={(
                    <CopyButton value={startURL}>
                      {({ copy }) => (
                        <UnstyledButton onClick={copy}>
                          <IconCopy size={16} />
                        </UnstyledButton>
                      )}
                    </CopyButton>
                  )}
                  sx={{ width: matches && '100%' }}
                />
              </Group>

              <Group sx={{ width: matches && '100%' }}>
                <TextInput
                  label="Stop webhook"
                  value={stopURL}
                  readOnly
                  rightSection={(
                    <CopyButton value={stopURL}>
                      {({ copy }) => (
                        <UnstyledButton onClick={copy}>
                          <IconCopy size={16} />
                        </UnstyledButton>
                      )}
                    </CopyButton>
                  )}
                  sx={{ width: matches && '100%' }}
                />
              </Group>
            </Group>

          </Stack>
        )}
        <Switch
          checked={allowRepeat}
          onChange={(e) => setAllowRepeat(e.currentTarget.checked)}
          label="Allow to repeat workflow"
          pt={10}
          sx={{ lineHeight: '20px', borderTop: '1px solid #D4D8DD' }}
        />
        {allowRepeat && (
          <Group>
            <NumberInput
              name="repeat delay"
              value={repeatDelay}
              onChange={setRepeatDelay}
              min={0}
              sx={(theme) => ({ width: 61, '& input, & button': { borderColor: theme.colors.gray[2] } })}
            />
            <Text size="sm">days to repeat workflow</Text>
          </Group>
        )}
        <Group
          position="apart"
          sx={{
            justifyContent: matches ? 'space-between' : 'flex-end',
            paddingBottom: matches && 45,
          }}
        >
          <Button
            variant="subtle"
            color="black"
            onClick={() => context.closeModal(id)}
            sx={{ fontWeight: 600 }}
          >
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
