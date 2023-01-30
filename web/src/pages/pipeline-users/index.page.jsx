import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Table,
  Text,
  UnstyledButton,
  TextInput,
  MultiSelect,
  Title,
  Stack,
  LoadingOverlay,
  Menu,
  ActionIcon,
  Group, Paper, ScrollArea,
} from '@mantine/core';
import { useLocalStorage, useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { openContextModal } from '@mantine/modals';
import { IconArrowDown, IconArrowUp, IconSearch, IconSettings, IconTrash, IconX } from '@tabler/icons';
import _filter from 'lodash/filter';
import _orderBy from 'lodash/orderBy';

import { useGetUsers, useRemoveUser, useAddPipelinesToUser } from 'resources/email-sequence/email-sequence.api';
import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';
import { showNotification } from '@mantine/notifications';
import CardSettingsButton from 'pages/email-sequences/components/card-settings-button';

import { useStyles } from './styles';

const UsersList = () => {
  const { classes } = useStyles();
  const { data } = useGetUsers();

  const matches = useMediaQuery('(max-width: 768px)');

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
  const [filters, setFilters] = useState({});

  const addPipelinesList = ({ pipelineIds, userId, userEmail }) => {
    handleAddUsersList({ pipelineIds, userId }, {
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
    const pipelineIds = pipelines
      .filter((pipeline) => selectedPipelines.includes(pipeline._id))
      .map((p) => p._id);
    addPipelinesList({ pipelineIds, userId, userEmail });
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

  useEffect(() => {
    if (Object.keys(filters).length) {
      const [key, value] = Object.entries(filters)[0];
      const subscribersSorted = _orderBy(
        users,
        (item) => item[key],
        [value],
      );
      setFilteredSubscribers(subscribersSorted || []);
    } else {
      setFilteredSubscribers(users || []);
    }
  }, [users, filters]);

  const handleSort = (sortField) => {
    if (filters[sortField] === 'asc') {
      setFilters({ [sortField]: 'desc' });
      return;
    }
    if (filters[sortField] === 'desc') {
      setFilters({});
    } else {
      setFilters({ [sortField]: 'asc' });
    }
  };

  const rows = filteredSubscribers.length > 0 ? filteredSubscribers.map((user) => (
    <tr key={user._id}>
      <td>{user.email}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>
        <MultiSelect
          data={getPipelinesList(pipelines)}
          defaultValue={[user?.pipeline?._id]}
          value={user?.pipelines?.map((p) => p._id)}
          clearButtonLabel="Clear selection"
          onChange={(value) => handlePipelinesList(value, user._id, user.email)}
          size="sm"
          styles={{
            wrapper: { maxWidth: 'max-content' },
            input: { border: 'none', padding: 0 },
            defaultValue: { paddingLeft: 0 },
          }}
        />
      </td>
      <td>
        <Menu position="bottom-end">
          <Menu.Target>
            <ActionIcon
              title="Settings"
              variant="transparent"
              sx={{ width: '100%', justifyContent: 'flex-end' }}
            >
              <CardSettingsButton />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              icon={<IconSettings size={14} />}
              onClick={() => openContextModal({
                modal: 'updateUser',
                size: 400,
                fullScreen: matches,
                title: 'Edit user',
                innerProps: { user, pipelines },
                styles: { title: { fontSize: 20, fontWeight: 600 } },
              })}
              sx={{
                padding: '20px 13px',
              }}
              className={classes.menuItem}
            >
              Settings
            </Menu.Item>
            <Menu.Item
              icon={<IconTrash size={14} />}
              color="red"
              onClick={() => removeUserHandler(user._id)}
              sx={{ padding: '20px 13px' }}
              className={classes.menuItem}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
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
      <Paper radius="sm" withBorder>
        <ScrollArea>
          <Table verticalSpacing="xs" horizontalSpacing="xs" className={classes.table}>
            <thead>
              <tr>
                <th>
                  <Group spacing={3}>
                    <ActionIcon
                      onClick={() => handleSort('email')}
                      className={classes.tableTitle}
                    >
                      Email
                      {filters.email === 'desc' && (
                      <IconArrowDown size={16} />
                      )}
                      {filters.email === 'asc' && (
                      <IconArrowUp size={16} />
                      )}
                    </ActionIcon>
                  </Group>
                </th>
                <th>
                  <Group spacing={3}>
                    <ActionIcon
                      onClick={() => handleSort('firstName')}
                      className={classes.tableTitle}
                    >
                      First name
                      {filters.firstName === 'desc' && (
                      <IconArrowDown size={16} />
                      )}
                      {filters.firstName === 'asc' && (
                      <IconArrowUp size={16} />
                      )}
                    </ActionIcon>
                  </Group>
                </th>
                <th>
                  <Group spacing={3}>
                    <ActionIcon
                      onClick={() => handleSort('lastName')}
                      className={classes.tableTitle}
                    >
                      Last name
                      {filters.lastName === 'desc' && (
                      <IconArrowDown size={16} />
                      )}
                      {filters.lastName === 'asc' && (
                      <IconArrowUp size={16} />
                      )}
                    </ActionIcon>
                  </Group>
                </th>
                <th>Pipeline</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Stack>
  );
};

export default UsersList;
