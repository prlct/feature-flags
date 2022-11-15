import { Stack, TextInput, Modal, Text, Group, Button } from '@mantine/core';
import { useContext } from 'react';
import { EmailSequencesContext } from '../email-sequences-context';

const AddUsersModal = () => {
  const { addUsersModal, closeAddUsersModal } = useContext(EmailSequencesContext);

  return (
    <Modal
      opened={addUsersModal}
      onClose={closeAddUsersModal}
      title="Send test email"
      withCloseButton={false}
      centered
    >
      <Stack>
        <Text size="lg" weight="bold">Add users</Text>
        <TextInput label="email" placeholder="some@email" />
        <Group position="apart">
          <Button variant="subtle" onClick={closeAddUsersModal}>
            Cancel
          </Button>
          <Button onClick={() => null}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AddUsersModal;
