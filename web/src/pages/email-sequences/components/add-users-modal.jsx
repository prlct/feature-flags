import { Stack, TextInput, Text, Group, Button } from '@mantine/core';

const AddUsersModal = ({ context, id, innerProps }) => {
  const handleAddUser = () => null;

  return (
    <Stack>
      <Text size="lg" weight="bold">Add users</Text>
      <TextInput label="email" placeholder="some@email" type="email" />
      <Group position="apart">
        <Button variant="subtle" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button onClick={handleAddUser}>
          Save
        </Button>
      </Group>
    </Stack>
  );
};

export default AddUsersModal;
