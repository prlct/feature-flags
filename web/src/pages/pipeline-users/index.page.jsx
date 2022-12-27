import { useCallback, useEffect, useState, useMemo } from 'react';
import { Table, Text, UnstyledButton, TextInput, MultiSelect, createStyles, Title, Stack, LoadingOverlay } from '@mantine/core';
import { useLocalStorage, useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconTrash, IconX } from '@tabler/icons';
import _filter from 'lodash/filter';

import { useGetUsers, useRemoveUser, useAddPipelinesToUser } from 'resources/email-sequence/email-sequence.api';
import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';
import { showNotification } from '@mantine/notifications';

const useStyles = createStyles(({ colors }) => ({
  headerGroup: {
    width: '100%',
    '@media (max-width: 768px)': {
      paddingTop: 16,
      '& h2': {
        fontSize: 18,
      },
    },
  },
  search: {
    width: 568,
    '& input': {
      border: `1px solid ${colors.gray[2]}`,
      borderRadius: 8,
      '@media (max-width: 768px)': {
        width: '100%',
      },
    },
  },
  table: {
    borderRadius: 8,
    '& thead tr th': {
      color: colors.gray[4],
      fontWeight: 400,
      padding: '8px 24px',
      lineHeight: '24px',
    },
    '& thead tr th:nth-child(4)': {
      width: '30%',
    },
  },
  multiSelect: {
    padding: 0,
  },
}));

const UsersList = () => {
  const { classes } = useStyles();
  const { data } = useGetUsers();

  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });
  const {
    data: pipelinesList,
    isLoading,
    isFetching,
  } = emailSequencesApi.useGetPipelines(env);

  const handleAddUsersList = useAddPipelinesToUser().mutate;

  const removeUserHandler = useRemoveUser().mutate;

  const pipelines = useMemo(() => pipelinesList?.results || [], [pipelinesList]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);

  const addPipelinesList = ({ pipelinesList, userId, userEmail }) => {
    handleAddUsersList({ pipelinesList, userId }, {
      onSuccess: () => {
        showNotification({
          title: 'Changed the list of pipelines',
          message: `Changed the list of pipelines for a user ${userEmail}`,
          color: 'green',
        });
      },
    });
  };

  const handlePipelinesList = (selectedPipelines, userId, userEmail) => {
    const pipelinesList = pipelines.filter((pipeline) => selectedPipelines.includes(pipeline._id));
    addPipelinesList({ pipelinesList, userId, userEmail });
  };

  const getPipelinesList = (pipelines) => pipelines
    .map((pipeline) => ({ value: pipeline._id, label: pipeline.name }));

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  useEffect(() => {
    if (data) {
      setUsers(data?.results);
    }
  }, [data, debouncedSearch, pipelinesList]);

  useEffect(() => {
    const subscribers = _filter(
      users,
      (item) => item.email.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
    setFilteredSubscribers(subscribers || []);
  }, [users, debouncedSearch]);

  const rows = filteredSubscribers.length > 0 ? filteredSubscribers.map((user) => (
    <tr key={user._id}>
      <td>{user.email}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>
        <MultiSelect
          data={getPipelinesList(pipelines)}
          defaultValue={[user.pipeline._id]}
          clearButtonLabel="Clear selection"
          onChange={(value) => handlePipelinesList(value, user._id, user.email)}
          styles={{
            root: { '& .mantine-Input-rightSection': { width: 0 } },
            input: { border: 'none', padding: 0 },
            defaultValue: { paddingLeft: 0 },
            rightSection: { pointerEvents: 'none' } }}
        />
      </td>
      <td>
        <UnstyledButton
          onClick={() => removeUserHandler(user._id)}
        >
          <IconTrash color="red" />
        </UnstyledButton>
      </td>
    </tr>
  )) : <Text mt={16}>No subscribers found</Text>;

  const isLoaderVisible = isLoading || isFetching;

  return (
    <Stack className={classes.headerGroup}>
      <LoadingOverlay visible={isLoaderVisible} overlayBlur={2} />
      <Title order={2}>Subscribers in email pipelines</Title>
      <TextInput
        className={classes.search}
        value={search}
        onChange={handleSearch}
        placeholder="Search by subscriber email"
        icon={<IconSearch size={16} />}
        rightSection={search ? (
          <UnstyledButton
            onClick={() => setSearch('')}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <IconX color="gray" />
          </UnstyledButton>
        ) : null}
      />
      <Table verticalSpacing="xs" horizontalSpacing="xs">
        <thead>
          <tr>
            <th>Email</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Pipeline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </Stack>
  );
};

export default UsersList;
