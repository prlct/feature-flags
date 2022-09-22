import { useCallback, useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Title,
  Text,
  Button,
  Stack,
  ScrollArea,
  ActionIcon,
  Group,
  Paper,
  Table,
} from '@mantine/core';
import { IconTool, IconPlus, IconTrash } from '@tabler/icons';
import _find from 'lodash/find';

import { featureFlagApi } from 'resources/feature-flag';

import TestConfigurationCreateModal from '../configuration-create-modal';
import ConfigurationRemoveModal from '../configuration-remove-modal';

const testingColumns = [
  { title: 'Variant' },
  { title: 'Seen by' },
  { title: 'Configuration' },
  { title: 'Actions' },
];

const ABTesting = ({ featureId, env }) => {
  const [isConfigurationCreateModalOpened, setIsConfigurationCreateModalOpened] = useState(false);
  const [isConfigurationRemoveModalOpened, setIsConfigurationRemoveModalOpened] = useState(false);
  const [deleteConfigurationId, setDeleteConfigurationId] = useState('');
  const [editConfigurationId, setEditConfigurationId] = useState('');
  const [editConfiguration, setEditConfiguration] = useState('');
  const { data: feature } = featureFlagApi.useGetById({ featureId, env });

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
  return (
    <>
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
                {feature?.tests.map(({ _id, name, configuration }) => (
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

ABTesting.propTypes = {
  featureId: PropTypes.string.isRequired,
  env: PropTypes.string.isRequired,
};

export default ABTesting;
