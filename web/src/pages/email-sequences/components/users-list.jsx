import { useContext } from 'react';

import { Box, Table, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons';

import { EmailSequencesContext } from '../email-sequences-context';

const UsersList = () => {
  const { users, setUsers, pipelines } = useContext(EmailSequencesContext);

  const getUserPipeline = (user) => {
    const pipeline = pipelines.find((p) => p.id === user.pipeline);
    const seq = pipeline?.sequences.find((s) => s.id === user.sequence);
    if (!seq) return;
    return `${pipeline.name} / ${seq.name}`;
  };

  const rows = users.map((user) => (
    <tr key={user.id}>
      <td>{user.email}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{getUserPipeline(user)}</td>
      <td>
        <UnstyledButton
          onClick={() => setUsers((prev) => prev.filter((u) => u.email !== user.email))}
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
