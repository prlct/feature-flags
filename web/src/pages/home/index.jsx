import { useCallback, useLayoutEffect, useState } from 'react';
import Head from 'next/head';
import {
  Select,
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
  ScrollArea,
  UnstyledButton,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDebouncedValue } from '@mantine/hooks';
import { IconChevronDown, IconSearch, IconX } from '@tabler/icons';
import { featureFlagsApi } from 'resources/feature-flags';

const columns = [
  {
    title: 'Feature name',
  },
  {
    title: 'Development',
  },
  {
    title: 'Staging',
  },
  {
    title: 'Production',
  },
  {
    title: 'Created on',
  },
  {
    title: 'Customization',
  },
];

const PER_PAGE = 3;

const Home = () => {
  const [search, setSearch] = useState('');
  const [newFeatureFlagName, setNewFeatureFlagName] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [params, setParams] = useState({});

  useLayoutEffect(() => {
    setParams((prev) => ({ ...prev, page: 1, searchValue: debouncedSearch, perPage: PER_PAGE }));
  }, [debouncedSearch]);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const handleFeatureFlagNameChange = useCallback((event) => {
    setNewFeatureFlagName(event.target.value);
  }, []);
  

  const { mutate: mutateFeatureEnvState, isLoading } = featureFlagsApi.useUpdateFeatureEnvState();

  const handleSwitchChange = (id, field) => mutateFeatureEnvState({ id, field }, {
    onSuccess: (data) => {
      queryClient.setQueryData(['featureFlags'], data => { console.log('data', data);});
      showNotification({
        title: 'Success',
        message: 'Your password have been successfully updated.',
        color: 'green',
      });
    },
    onError: (e) => handleError(e, setError),
  });

  const { data, isLoading: isListLoading } = featureFlagsApi.useList(params);

  const handleFeatureFlagCreate = () => {

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
            sx={{ flexGrow: '0.25', overflow: !isListLoading ? 'initial' : 'overflow' }}
          >
            <Group grow="1">
              <TextInput
                value={newFeatureFlagName}
                onChange={handleFeatureFlagNameChange}
                placeholder="Enter new feature flag name"
                rightSectionWidth="200"
                rightSection={
                  <Button onClick={handleFeatureFlagCreate}>
                    Create
                  </Button>
                }
              />
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
        {data?.items.length ? (
          <>
            <Paper radius="sm" withBorder>
              <ScrollArea>
                <Table
                  horizontalSpacing="xl"
                  verticalSpacing="lg"
                >
                  <thead>
                    <tr>
                      {columns.map(({ title }) => (
                        <th key={title}>{title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map(({ _id, name, development, staging, production, createdOn }) => (
                      <tr key={_id}>
                        <td>{name}</td>
                        <td><Switch checked={development} onChange={() => handleSwitchChange(_id, 'development')} /></td>
                        <td><Switch checked={staging} onChange={() => handleSwitchChange(_id, 'staging')} /></td>
                        <td><Switch checked={production} onChange={() => handleSwitchChange(_id, 'production')} /></td>
                        <td>{createdOn}</td>
                        <td></td>
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
    </>
  );
};

export default Home;
