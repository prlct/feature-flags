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
import { useLocalStorage, useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { IconSearch, IconX, IconSettings, IconTrash } from '@tabler/icons';
import _filter from 'lodash/filter';
import { featureFlagApi } from 'resources/feature-flag';
import { applicationApi } from 'resources/application';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';
import { useGrowthFlags } from 'contexts/growth-flags-context';
import { useAmplitude } from 'contexts/amplitude-context';

import CardSettingsButton from 'pages/email-sequences/components/card-settings-button';
import { dashboardColumns } from './index.constants';
import FeatureFlagCreateModal from './components/feature-flag-create-modal';
import PaymentSuccessModal from './components/payment-success-modal';
import MessagingText from './components/targeting-message';

import { useStyles } from './styles';

const Home = () => {
  const modals = useModals();
  const { classes } = useStyles();
  const matches = useMediaQuery('(max-width: 768px)');

  const growthFlags = useGrowthFlags();
  const amplitude = useAmplitude();

  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });

  const [isFeatureCreateModalOpened, setIsFeatureCreateModalOpened] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [filteredFeatureFlags, setFilteredFeatureFlags] = useState([]);

  const { data, refetch, isRefetching, isLoading } = applicationApi.useGetFeaturesList(env);

  const isABTestingOn = growthFlags && growthFlags.isOn('abTesting');

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
        amplitude.track('Delete feature flag');
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

  if (matches) {
    return (
      <>
        <Head>
          <title>Feature flags</title>
        </Head>
        <Stack spacing="lg">

          <Group className={classes.headerGroup}>
            <Title order={2}>Feature flags</Title>
            <Button
              className={classes.addButton}
              variant="light"
              onClick={() => setIsFeatureCreateModalOpened(true)}
            >
              + Add feature flag
            </Button>
          </Group>
          <Skeleton
            height={42}
            radius="sm"
            visible={isLoading}
            width="100%"
            sx={{ flexGrow: '0.25' }}
          >
            <TextInput
              className={classes.search}
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
          <Paper radius="sm">
            <ScrollArea>
              <Stack spacing={8} pb={20}>
                {filteredFeatureFlags
                  .map(({
                    _id,
                    name,
                    description,
                    enabled,
                    enabledForEveryone,
                    createdOn,
                    usersPercentage,
                    targetingRules,
                    tests,
                    usersViewedCount,
                    env }) => (
                      <Stack key={_id} spacing={14} className={classes.itemBlock}>
                        <Stack spacing={0}>
                          <Group sx={{ justifyContent: 'space-between' }}>
                            <Text size="md" weight={700} sx={{ height: 18 }}>
                              {name}
                            </Text>

                            <Menu position="bottom-end">
                              <Menu.Target>
                                <ActionIcon
                                  title="Settings"
                                  variant="transparent"
                                  disabled={isRefetching}
                                  className={classes.menuButton}
                                >
                                  <CardSettingsButton />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown sx={{ width: '192px !important', height: 112 }}>
                                <Menu.Item
                                  component={NextLink}
                                  href={`${routes.path.featureFlag}/${_id}`}
                                  icon={!matches && <IconSettings size={14} />}
                                  sx={{ padding: '14px 13px' }}
                                >
                                  Settings
                                </Menu.Item>
                                <Menu.Item
                                  icon={!matches && <IconTrash size={14} />}
                                  color="red"
                                  onClick={() => handleFeatureDelete({ _id, name })}
                                  sx={{ padding: '14px 13px' }}
                                >
                                  Delete
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                            {isABTestingOn && tests.length && <Badge variant="gradient" gradient={{ from: 'lime', to: 'blue' }}>A/B testing</Badge>}
                          </Group>
                          <Text size="sm" color="grey" sx={{ height: 18 }}>{description}</Text>
                        </Stack>

                        <Group sx={{ height: 20 }}>
                          <Text>{`${usersViewedCount} ${pluralize('user', usersViewedCount)}`}</Text>
                          <Text>{new Date(createdOn).toLocaleDateString('en-US')}</Text>
                        </Group>

                        <Group sx={{ height: 20 }}>
                          <Switch
                            checked={enabled}
                            sx={{ display: 'flex', label: { cursor: 'pointer' } }}
                            disabled={isRefetching}
                            onChange={() => handleSwitchChange({
                              _id,
                              enabled,
                              name,
                              env })}
                          />
                          <MessagingText
                            enabledForEveryone={enabledForEveryone}
                            usersPercentage={usersPercentage}
                            targetingRulesCount={targetingRules?.length || 0}
                          />
                        </Group>
                      </Stack>
                  ))}
              </Stack>
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
  }

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
            width={568}
            sx={{ flexGrow: '0.25' }}
          >
            <TextInput
              className={classes.search}
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
            <Button
              className={classes.addButton}
              variant="light"
              onClick={() => setIsFeatureCreateModalOpened(true)}
            >
              + Add feature flag
            </Button>
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
                className={classes.table}
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
                      targetingRules,
                      tests,
                      usersViewedCount,
                      env }) => (
                        <tr key={_id}>
                          <td>
                            <Group>
                              <Text size="md" weight={700}>
                                {name}
                              </Text>
                              {isABTestingOn && tests.length && <Badge variant="gradient" gradient={{ from: 'lime', to: 'blue' }}>A/B testing</Badge>}
                            </Group>
                            <Text size="sm" color="grey">{description}</Text>
                          </td>
                          <td>
                            <Group>
                              <Switch
                                checked={enabled}
                                sx={{ display: 'flex', label: { cursor: 'pointer' } }}
                                disabled={isRefetching}
                                onChange={() => handleSwitchChange({
                                  _id,
                                  enabled,
                                  name,
                                  env })}
                              />
                              <Stack spacing={0}>
                                <MessagingText
                                  enabledForEveryone={enabledForEveryone}
                                  usersPercentage={usersPercentage}
                                  targetingRulesCount={targetingRules?.length || 0}
                                />
                              </Stack>
                            </Group>
                          </td>
                          <td>
                            {`${usersViewedCount} ${pluralize('user', usersViewedCount)}`}
                          </td>
                          <td>{new Date(createdOn).toLocaleDateString('en-US')}</td>
                          <td>
                            <Menu>
                              <Menu.Target>
                                <ActionIcon
                                  title="Settings"
                                  variant="transparent"
                                  disabled={isRefetching}
                                  className={classes.menuButton}
                                  sx={{
                                    width: '100%',
                                    justifyContent: 'flex-end',
                                  }}
                                >
                                  <CardSettingsButton />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
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
                              </Menu.Dropdown>
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
