import { useCallback, useEffect, useState } from 'react';
import pluralize from 'pluralize';
import Head from 'next/head';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import _trim from 'lodash/trim';
import _find from 'lodash/find';
import { useForm } from 'react-hook-form';
import {
  Title,
  Loader,
  Text,
  TextInput,
  Button,
  Divider,
  Stack,
  Switch,
  ScrollArea,
  ActionIcon,
  Badge,
  Select,
  Group,
  Tabs,
  Paper,
  Breadcrumbs,
  Table,
  Alert,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconX, IconTool, IconPlus, IconTrash } from '@tabler/icons';
import { featureFlagApi } from 'resources/feature-flag';
import { Link } from 'components';
import * as routes from 'routes';
import { handleError } from 'helpers';
import { useGrowthFlags } from 'contexts/growth-flags-context';

import { useRouter } from 'next/router';

import { applicationApi } from 'resources/application';
import TestConfigurationCreateModal from './components/configuration-create-modal';
import ConfigurationRemoveModal from './components/configuration-remove-modal';
import FeatureFlagDescription from './components/feature-flag-description';

import { testingColumns, percentageSelectList } from './index.constants';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.'),
});

const FeatureFlag = () => {
  const router = useRouter();
  const [isConfigurationCreateModalOpened, setIsConfigurationCreateModalOpened] = useState(false);
  const [isConfigurationRemoveModalOpened, setIsConfigurationRemoveModalOpened] = useState(false);
  const [deleteConfigurationId, setDeleteConfigurationId] = useState('');
  const [editConfigurationId, setEditConfigurationId] = useState('');
  const [editConfiguration, setEditConfiguration] = useState('');
  const [usersPercentageValue, setUsersPercentageValue] = useState('');
  const growthFlags = useGrowthFlags();
  const { id, env } = router.query;

  const { data: feature } = featureFlagApi.useGetById({ _id: id, env });
  const { data: application } = applicationApi.useGetApplication();

  useEffect(() => {
    setUsersPercentageValue((feature?.usersPercentage || '').toString());
  }, [feature?.usersPercentage]);

  const {
    register, handleSubmit, formState: { errors }, setError, reset,
  } = useForm({ resolver: yupResolver(schema) });

  const enableFeatureForUsersMutation = featureFlagApi.useEnableFeatureForUsers();

  const handleEmailsAdd = ({ email }) => {
    const trimmedEmail = _trim(email);

    if (trimmedEmail) {
      enableFeatureForUsersMutation.mutate({
        email: trimmedEmail,
        env: feature.env,
        _id: feature._id,
      }, {
        onSuccess: () => {
          reset({ email: '' });
          showNotification({
            title: 'Success',
            message: `The feature has been successfully enabled to the user ${email}.`,
            color: 'green',
          });
        },
        onError: (e) => handleError(e, setError),
      });
    }
  };

  const disableFeatureForUserMutation = featureFlagApi.useDisableFeatureForUser();

  const handleEmailDelete = (email) => {
    const trimmedEmail = _trim(email);

    if (trimmedEmail) {
      disableFeatureForUserMutation.mutate({
        email: trimmedEmail,
        env: feature.env,
        _id: feature._id,
      }, {
        onSuccess: () => {
          reset({ email: '' });
          showNotification({
            title: 'Success',
            message: `The feature has been successfully disabled to the user ${email}.`,
            color: 'green',
          });
        },
        onError: (e) => handleError(e, setError),
      });
    }
  };

  const toggleFeatureStatusMutation = featureFlagApi.useToggleFeatureStatusOnSettingsPage();

  // TODO: Disable feature toggler during request / add loader?
  const handleSwitchChange = (data) => toggleFeatureStatusMutation.mutate(data, {
    onSuccess: ({ enabled }) => {
      showNotification({
        title: 'Success',
        message: `The feature was successfully ${enabled ? 'enabled' : 'disabled'}`,
        color: 'green',
      });
    },
    onError: (e) => handleError(e, setError),
  });

  const changeFeatureVisibilityMutation = featureFlagApi.useChangeFeatureVisibility();

  const handleFeatureVisibilityChange = (visibility) => {
    const enabledForEveryone = visibility === 'everyone';
    const reqData = { _id: feature._id, enabledForEveryone, env: feature.env };

    return changeFeatureVisibilityMutation.mutate(reqData, {
      onSuccess: (visibility) => {
        if (!feature.enabled) {
          return;
        }

        if (visibility === 'everyone') {
          showNotification({
            title: 'Success',
            message: `Feature ${feature.name} is now visible for all users.`,
            color: 'green',
          });
        }

        if (visibility === 'group') {
          showNotification({
            title: 'Success',
            message: `Feature ${feature.name} is now visible only for some user.`,
            color: 'green',
          });
        }
      },
      onError: (e) => handleError(e, setError),
    });
  };

  const changeUsersPercentageMutation = featureFlagApi.useChangeUsersPercentage();

  const handleUsersPercentageChange = (percentage) => changeUsersPercentageMutation.mutate({
    _id: feature._id,
    percentage,
    env: feature.env,
  }, {
    onSuccess: ({ usersPercentage }) => {
      showNotification({
        title: 'Success',
        message: `The feature will be displayed for ${usersPercentage || 0} percent of users.`,
        color: 'green',
      });
    },
    onError: (e) => handleError(e, setError),
  });

  const handelConfigurationEdit = useCallback((configurationId) => () => {
    const test = _find(feature?.tests, { _id: configurationId });
    setEditConfiguration(test.configuration);
    setEditConfigurationId(configurationId);
    setIsConfigurationCreateModalOpened(true);
  }, [feature?.tests]);

  const handleConfigurationCreateModalClose = useCallback(() => {
    setIsConfigurationCreateModalOpened(false);
    setEditConfiguration('');
    setEditConfigurationId('');
  }, []);

  const handelConfigurationDelete = useCallback((configurationId) => () => {
    setDeleteConfigurationId(configurationId);
    setIsConfigurationRemoveModalOpened(true);
  }, []);

  const breadcrumbItems = [
    { title: 'Feature flags', href: routes.route.home },
    { title: feature?.name, href: '#' },
  ].map((item, index) => (
    <Link type="router" size="xl" href={item.href} key={index} underline={false}>
      {item.title}
    </Link>
  ));

  return (
    <>
      <Head>
        <title>{feature?.name}</title>
      </Head>

      {feature?.name ? (
        <Stack spacing="sm">
          <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>

          {/* TODO: Connect tabs with url */}
          <Tabs>
            <Tabs.Tab label="Settings">
              <Stack sx={{ maxWidth: '520px' }}>
                <Group position="apart" align="flex-end">
                  <Stack sx={{ maxWidth: '200px' }}>
                    <Select
                      label={
                        <Title order={4}>Enable for</Title>
                      }
                      placeholder="Choose for whom to show the feature"
                      value={feature.enabledForEveryone ? 'everyone' : 'group'}
                      data={[
                        { value: 'everyone', label: 'All users' },
                        { value: 'group', label: 'Some users' },
                      ]}
                      onChange={handleFeatureVisibilityChange}
                    />
                  </Stack>
                  <Switch
                    label={
                      <Title order={4}>{`Feature ${feature?.enabled ? 'enabled' : 'disabled'}`}</Title>
                    }
                    styles={{ input: { cursor: 'pointer' } }}
                    checked={feature.enabled}
                    onChange={() => handleSwitchChange({ _id: feature._id, enabled: feature.enabled, env: feature.env })}
                  />
                </Group>

                <Stack>
                  <Title order={4}>Info</Title>
                  <FeatureFlagDescription featureFlag={feature} />
                </Stack>

                <Text size="sm" mb={-16}>The settings below will only apply if the feature is enabled for some users</Text>
                <Divider my="sm" mt={0} />
                <Stack sx={{ maxWidth: '200px' }}>
                  <Select
                    label={
                      <Title order={4}>Percentage of users</Title>
                    }
                    placeholder="Select a percentage"
                    clearable
                    value={usersPercentageValue}
                    data={percentageSelectList}
                    disabled={feature.enabledForEveryone}
                    onChange={handleUsersPercentageChange}
                  />
                </Stack>

                {/* TODO: add link to the docs */}
                { !feature.enabledForEveryone && application && !application.trackEnabled
                  && <Alert color="yellow">% of users can not be used, before implementing feature tracking</Alert>}

                <TextInput
                  label={
                    <Title order={4}>Individual users</Title>
                  }
                  {...register('email')}
                  placeholder="Enter user email"
                  error={errors?.email?.message}
                  rightSectionWidth="200"
                  rightSection={(
                    <Button
                      disabled={feature.enabledForEveryone}
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      onClick={handleSubmit(handleEmailsAdd)}
                    >
                      Add
                    </Button>
                  )}
                  disabled={feature.enabledForEveryone}
                />

                <Text component="p" m={0}>
                  Enabled for
                  {' '}
                  {feature.users.length}
                  {' '}
                  {pluralize('user', feature.users.length)}
                </Text>
                <ScrollArea style={{ height: 300 }}>
                  <Group spacing="sm">
                    {feature.users.map((user) => (
                      <Badge
                        sx={{ height: 26 }}
                        key={user}
                        variant="outline"
                        rightSection={(
                          <ActionIcon
                            disabled={feature.enabledForEveryone}
                            size="xs"
                            color="blue"
                            radius="xl"
                            variant="transparent"
                            onClick={() => handleEmailDelete(user)}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                      )}
                      >
                        {user}
                      </Badge>
                    ))}
                  </Group>
                </ScrollArea>
              </Stack>
            </Tabs.Tab>

            {growthFlags && growthFlags.isOn('abTesting') && (
            <Tabs.Tab label="A/B testing">
              <Stack>
                <Group grow="1">
                  <Title order={4}>Configurations</Title>
                  <Group position="right">
                    <Button width="auto" leftIcon={<IconPlus />} onClick={() => setIsConfigurationCreateModalOpened(true)}>
                      Add configuration
                    </Button>
                  </Group>
                </Group>

                <Paper radius="sm" withBorder>
                  <ScrollArea>
                    <Table
                      horizontalSpacing="xl"
                      verticalSpacing="lg"
                    >
                      <thead>
                        <tr>
                          {testingColumns.map(({ title }) => (
                            <th key={title}>{title}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {feature.tests.map(({ _id, name, configuration }) => (
                          <tr key={_id}>
                            <td>
                              <Text sx={{ width: 200 }} size="md" weight={700}>
                                {name}
                              </Text>
                            </td>
                            <td>
                              <Text sx={{ width: 100 }}>
                                0 users
                              </Text>
                            </td>
                            <td>
                              <Text>
                                {configuration}
                              </Text>
                            </td>
                            <td>
                              <Group sx={{ width: 200 }}>
                                <Button size="sm" leftIcon={<IconTool />} onClick={handelConfigurationEdit(_id)}>
                                  Configure
                                </Button>
                                <ActionIcon
                                  size="lg"
                                  color="red"
                                  variant="filled"
                                  onClick={handelConfigurationDelete(_id)}
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Group>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </ScrollArea>
                </Paper>
              </Stack>
            </Tabs.Tab>
            )}
          </Tabs>
        </Stack>
      ) : (
        <Loader />
      )}

      <TestConfigurationCreateModal
        opened={isConfigurationCreateModalOpened}
        configurationId={editConfigurationId}
        configuration={editConfiguration}
        onClose={handleConfigurationCreateModalClose}
      />

      <ConfigurationRemoveModal
        opened={isConfigurationRemoveModalOpened}
        configurationId={deleteConfigurationId}
        onClose={() => setIsConfigurationRemoveModalOpened(false)}
      />
    </>
  );
};

export default FeatureFlag;
