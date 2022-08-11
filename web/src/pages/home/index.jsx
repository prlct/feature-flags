import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
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
  SegmentedControl,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDebouncedValue } from '@mantine/hooks';
import { IconPlus, IconSearch, IconX, IconSettings } from '@tabler/icons';
import {
  trim as _trim,
  filter as _filter,
} from 'lodash';
import { featureFlagsApi } from 'resources/feature-flags';

import { Link } from 'components';
import * as routes from 'routes';
import { handleError } from 'helpers';

import { environmentsList, dashboardColumns } from './index.constants';
import FeatureFlagCreateModal from './components/feature-flag-create-modal';

const Home = () => {
  const [environment, setEnvironment] = useState(environmentsList[0].value);
  const [isFeatureCreateModalOpened, setIsFeatureCreateModalOpened] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [filteredFeatureFlags, setFilteredFeatureFlags] = useState([]);

  const { data, isLoading: isListLoading } = featureFlagsApi.useGetList();

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  useEffect(() => {
    const filteredFlags = _filter(data?.items, (item) => item.name.toLowerCase().includes(debouncedSearch.toLowerCase()));

    setFilteredFeatureFlags(filteredFlags || []);
  }, [data?.items?.length, debouncedSearch]);

  const toggleFeatureStatusMutation = featureFlagsApi.useToggleFeatureStatus();

  // TODO: Disable feature toggler during request / add loader ?
  const handleSwitchChange = (data) => toggleFeatureStatusMutation.mutate(data, {
    onSuccess: ({ enabled }) => {
      showNotification({
        title: 'Success',
        message: `The feature was successfully ${enabled ? 'disabled' : 'enabled'}`,
        color: 'green',
      });
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Head>
        <title>Feature flags</title>
      </Head>
      <Group position='right'>
        <SegmentedControl
          value={environment}
          onChange={setEnvironment}
          data={environmentsList}
        />
      </Group>
      <Stack spacing="lg">
        <Title order={2}>Feature flags</Title>
        <Group position="apart">
          <Skeleton
            height={42}
            radius="sm"
            visible={isListLoading}
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
            visible={isListLoading}
            width="auto"
            sx={{ overflow: !isListLoading ? 'initial' : 'overflow' }}
          >
            <Group grow="1">
              <Button leftIcon={<IconPlus />} onClick={() => setIsFeatureCreateModalOpened(true)}>
                Create feature flag
              </Button>
            </Group>
          </Skeleton>
        </Group>

        {isListLoading && (
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
        {filteredFeatureFlags.length ? (
          <>
            <Paper radius="sm" withBorder>
              <ScrollArea>
                <Table
                  horizontalSpacing="xl"
                  verticalSpacing="lg"
                >
                  <thead>
                    <tr>
                      {dashboardColumns.map(({ title }) => (
                        <th key={title}>{title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeatureFlags.map(({ _id, name, description, enabled, enabledForEveryone, createdOn, usersPercentage, users, tests }) => (
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
                            <Switch checked={enabled} onChange={() => handleSwitchChange({ _id, enabled })} />
                            <Text>{enabledForEveryone ? 'For everyone' : (usersPercentage ? `For ${usersPercentage}% of users` : `For ${users.length} users`)}</Text>
                          </Stack>   
                        </td>
                        <td>0 users</td>
                        <td>{new Date(createdOn).toLocaleDateString("en-US")}</td>
                        <td>
                          <Group>
                            <Link type="router" href={`${routes.path.featureFlag}/${_id}`} underline={false}>
                              <Button size="sm" leftIcon={<IconSettings />}>
                                Settings
                              </Button>
                            </Link>
                          </Group>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            </Paper>
          </>
        ) : (
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
    </>
  );
};

export default Home;
