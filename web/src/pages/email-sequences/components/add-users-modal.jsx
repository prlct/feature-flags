import { Stack, TextInput, Modal, Text, Group, Button } from '@mantine/core';

const AddUsersModal = () => {

  return (
    <Modal
      title="Send test email"
      withCloseButton={false}
      centered
    >
      <Stack>
        <Text size="lg" weight="bold">Add users</Text>
        <TextInput label="email" placeholder="some@email" />
        <Group position="apart">
          <Button variant="subtle">
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
