import { UnstyledButton, Stack, Group, Modal, Select, TextInput, CopyButton, Button } from '@mantine/core';
import { useContext, useState } from 'react';
import { IconCopy } from '@tabler/icons';
import { EmailSequencesContext } from '../email-sequences-context';

const TRIGGERS = [
  {
    id: 'sign_up_trigger',
    name: 'Sign up',
    applicationId: '1',
  },
  {
    id: 'first feature-created',
    name: 'first feature created',
    applicationId: '1',
  },
];

const TriggerSelectionModal = () => {
  const { context, dispatch } = useContext(EmailSequencesContext);
  const mappedTriggers = TRIGGERS.map((tr) => ({ ...tr, value: tr.id, label: tr.name }));

  const [trigger, setTrigger] = useState(mappedTriggers[0]);

  const startURL = `${trigger.id}/${trigger.applicationId}/start`;
  const stopURL = `${trigger.id}/${trigger.applicationId}/stop`;

  return (
    <Modal
      opened={context.triggerSelection}
      onClose={() => dispatch({ name: 'triggerSelection', type: 'close-modal' })}
      title="Choose trigger"
      withCloseButton={false}
      centered
    >
      <Select
        data={mappedTriggers}
        label="Trigger"
        value={trigger.value}
        onChange={(e) => {
          setTrigger(mappedTriggers.find((tr) => tr.value === e));
        }}
      />
      <Stack>
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
        <Group position="apart">
          <Button variant="subtle" onClick={() => dispatch({ type: 'close-modal', name: 'triggerSelection' })}>
            Cancel
          </Button>
          <Button>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default TriggerSelectionModal;
