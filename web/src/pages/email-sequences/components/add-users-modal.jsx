import { useState } from 'react';
import { Stack, TextInput, Text, Group, Button } from '@mantine/core';

import { useAddUsers } from 'resources/email-sequence/email-sequence.api';

const AddUsersModal = ({ context, id, innerProps }) => {
  const { sequence } = innerProps;

  const sequenceId = sequence._id;
  const handleAddUser = useAddUsers(sequenceId).mutate;
  const [email, setEmail] = useState('');

  const addUser = ({ email, sequenceId }) => {
    handleAddUser({ email, sequenceId }, {
      onSuccess: () => {
        context.closeModal(id);
      },
    });
  };

  return (
    <Stack>
      <Text size="lg" weight="bold">Add users</Text>
      <TextInput
        label="email"
        placeholder="some@email.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <Group position="apart">
        <Button variant="subtle" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button onClick={() => addUser({ email, sequenceId })}>
          Save
        </Button>
      </Group>
    </Stack>
  );
};

export default AddUsersModal;
