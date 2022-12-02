import { useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { Box, Table, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons';

import { emailSequenceApi } from 'resources/email-sequence';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';
import { EmailSequencesContext, EXAMPLE_PIPELINES } from '../email-sequences-context';

const UsersList = () => {
  const { users, setUsers } = useContext(EmailSequencesContext);

  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });

  const { data: fetchedPipelines, isFetching } = emailSequenceApi.useGetPipelines({ env });

  const [pipelines, setPipelines] = useState(null);

  const getUserPipeline = (user) => {
    if (!pipelines) {
      return;
    }
    const pipeline = pipelines.find((p) => p._id === user.pipeline);
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

  useEffect(() => {
    if (fetchedPipelines?.results.length) {
      setPipelines(fetchedPipelines.results);
      return;
    }

    if (!isFetching) {
      setPipelines(EXAMPLE_PIPELINES);
    }
  }, [fetchedPipelines, env, isFetching]);

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
