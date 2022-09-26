import { useCallback, useEffect, useState } from 'react';
import pluralize from 'pluralize';
import Head from 'next/head';
import { NextLink } from '@mantine/next';
import {
  Button,
  TextInput,
  Group,
  Title,
  Stack,
  Skeleton,
  Table,
  Text,
  Container,
  Switch,
  Paper,
  Badge,
  ScrollArea,
  UnstyledButton,
  ActionIcon,
  Menu,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useLocalStorage, useDebouncedValue } from '@mantine/hooks';
import { IconPlus, IconSearch, IconX, IconSettings, IconTrash, IconTool } from '@tabler/icons';
import _filter from 'lodash/filter';
import { featureFlagApi } from 'resources/feature-flag';
import { applicationApi } from 'resources/application';
import { useGrowthFlags } from 'contexts/growth-flags-context';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';

import { dashboardColumns } from './index.constants';
import FeatureFlagCreateModal from './components/feature-flag-create-modal';
import PaymentSuccessModal from './components/payment-sucess-modal';

const Home = () => {
  const modals = useModals();

  const [env] = useLocalStorage({ key: LOCAL_STORAGE_ENV_KEY, defaultValue: ENV.DEVELOPMENT });
  const [isFeatureCreateModalOpened, setIsFeatureCreateModalOpened] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [filteredFeatureFlags, setFilteredFeatureFlags] = useState([]);
  const growthFlags = useGrowthFlags();

  const { data, refetch, isRefetching, isLoading } = applicationApi.useGetFeaturesList(env);

  useEffect(() => {
    refetch();
  }, [env, refetch]);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  useEffect(() => {
    const filteredFlags = _filter(
      data,
      (item) => item.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );

    setFilteredFeatureFlags(filteredFlags || []);
    // to update on env change and new item adding
  }, [data, data?.length, debouncedSearch]);

  const toggleFeatureStatusMutation = featureFlagApi.useToggleFeatureStatus();
  const deleteFeatureMutation = featureFlagApi.useDeleteFeature();

  // TODO: Disable feature toggler during request / add loader ?
  const handleSwitchChange = (data) => toggleFeatureStatusMutation.mutate(data, {
    onSuccess: (item) => {
      showNotification({
        title: 'Success',
        message: `The ${item.name} feature flag is now ${item.enabled ? 'on' : 'off'}.`,
        color: 'green',
      });
    },
    onError: (e) => handleError(e),
  });

  const deleteFeature = (id) => {
    deleteFeatureMutation.mutate({ _id: id }, {
      onSuccess: () => {
        showNotification({
          title: 'Success',
          message: 'Feature flag has been successfully deleted.',
          color: 'green',
        });
      },
    });
  };

  const handleFeatureDelete = (feature) => {
    modals.openConfirmModal({
      title: (<Title order={3}>Delete feature flag</Title>),
      centered: true,
      children: (
        <Text>
          Feature flag
          {' '}
          <Text weight={700} component="span">{feature?.name}</Text>
          {' '}
          will be deleted for ALL environments. Are you sure?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'subtle' },
      cancelProps: { variant: 'subtle' },
      onConfirm: () => deleteFeature(feature._id),
    });
  };

  return (
    <>
      <Head>
        <title>Feature flags</title>
      </Head>
      <Stack spacing="lg">
        <Title order={2}>Feature flags</Title>
        <Group position="apart">
          <Skeleton
            height={42}
            radius="sm"
            visible={isLoading}
            width="auto"
            sx={{ flexGrow: '0.25' }}
          >
            <TextInput
              value={search}
              onChange={handleSearch}
              placeholder="Search by feature name"
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
          </Skeleton>
          <Skeleton
            height={42}
            radius="sm"
            visible={isLoading}
            width="auto"
            sx={{ overflow: !isLoading ? 'initial' : 'overflow' }}
          >
            <Group grow="1">
              <Button leftIcon={<IconPlus />} onClick={() => setIsFeatureCreateModalOpened(true)}>
                Create feature flag
              </Button>
            </Group>
          </Skeleton>
        </Group>

        {isLoading && (
          <>
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={`skeleton-${String(item)}`}
                height={50}
                radius="sm"
                mb="sm"
              />
            ))}
          </>
        )}
        {(!!filteredFeatureFlags.length && !isLoading) && (
          <Paper radius="sm" withBorder>
            <ScrollArea>
              <Table
                horizontalSpacing="xl"
                verticalSpacing="lg"
              >
                <thead>
                  <tr>
                    {dashboardColumns.map(({ title, width }) => (
                      <th key={title} style={{ width }}>{title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFeatureFlags
                    .map(({
                      _id,
                      name,
                      description,
                      enabled,
                      enabledForEveryone,
                      createdOn,
                      usersPercentage,
                      users,
                      tests,
                      usersViewedCount,
                      env }) => (
                        <tr key={_id}>
                          <td>
                            <Group>
                              <Text size="md" weight={700}>
                                {name}
                              </Text>
                              {tests.length && <Badge variant="gradient" gradient={{ from: 'lime', to: 'blue' }}>A/B testing</Badge>}
                            </Group>
                            <Text size="sm" color="grey">{description}</Text>
                          </td>
                          <td>
                            <Stack>
                              <Switch
                                checked={enabled}
                                styles={{ input: { cursor: 'pointer' } }}
                                disabled={isRefetching}
                                onChange={() => handleSwitchChange({
                                  _id,
                                  enabled,
                                  name,
                                  env })}
                              />
                              <Text>{enabledForEveryone ? 'For everyone' : (usersPercentage ? `For ${usersPercentage}% of users` : `For ${users.length} users`)}</Text>
                            </Stack>
                          </td>
                          <td>
                            {usersViewedCount}
                            {' '}
                            {pluralize('user', usersViewedCount)}
                          </td>
                          <td>{new Date(createdOn).toLocaleDateString('en-US')}</td>
                          <td>
                            <Menu control={(
                              <ActionIcon
                                title="Settings"
                                variant="transparent"
                                disabled={isRefetching}
                                sx={{
                                  '&:disabled': {
                                    backgroundColor: 'transparent',
                                    border: 0,
                                  },
                                }}
                              >
                                <IconTool />
                              </ActionIcon>
                        )}
                            >
                              <Menu.Item
                                component={NextLink}
                                href={`${routes.path.featureFlag}/${_id}`}
                                icon={<IconSettings size={14} />}
                              >
                                Settings
                              </Menu.Item>
                              <Menu.Item
                                icon={<IconTrash size={14} />}
                                color="red"
                                onClick={() => handleFeatureDelete({ _id, name })}
                              >
                                Delete
                              </Menu.Item>
                            </Menu>

                          </td>
                        </tr>
                    ))}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
        )}
        {(!filteredFeatureFlags.length && !!search && !isLoading) && (
          <Container p={75}>
            <Text size="xl" color="grey">
              No results found, try to adjust your search.
            </Text>
          </Container>
        )}
      </Stack>

      <FeatureFlagCreateModal
        opened={isFeatureCreateModalOpened}
        onClose={() => setIsFeatureCreateModalOpened(false)}
      />

      <PaymentSuccessModal />
    </>
  );
};

export default Home;
