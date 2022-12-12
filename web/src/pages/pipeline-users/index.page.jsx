import { Box, Table, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons';

import { useGetUsers, useRemoveUser } from 'resources/email-sequence/email-sequence.api';

const UsersList = () => {
  const { data } = useGetUsers();
  const users = data?.results || [];

  const removeUserHandler = useRemoveUser().mutate;

  const rows = users.length > 0 ? users.map((user) => (
    <tr key={user._id}>
      <td>{user.email}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{`${user.pipeline.name} / ${user.sequence.name}`}</td>
      <td>
        <UnstyledButton
          onClick={() => removeUserHandler(user._id)}
        >
          <IconTrash color="red" />
        </UnstyledButton>
      </td>
    </tr>
  )) : <Text mt={16}>No users found</Text>;

  return (
    <Box>
      <Text>Users in email sequences</Text>
      <Table verticalSpacing="xs" horizontalSpacing="xs">
        <thead>
          <tr>
            <th>Email</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Pipeline/sequence</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </Box>
  );
};

export default UsersList;
