import { Box, Table, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons';

import { useGetUsers } from 'resources/email-sequence/email-sequence.api';

const UsersList = () => {
  const { data } = useGetUsers();
  const users = data?.results || [];
  const rows = users.map((user) => (
    <tr key={user.id}>
      <td>{user.email}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{(user.pipelineId)}</td>
      <td>
        <UnstyledButton
          onClick={() => null}
        >
          <IconTrash color="red" />
        </UnstyledButton>
      </td>
    </tr>
  ));

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
