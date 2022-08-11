import {
  Modal,
  Button,
  Stack,
  Title,
  Group,
} from '@mantine/core';
import PropTypes from 'prop-types';
import { showNotification } from '@mantine/notifications';

import { handleError } from 'helpers';
import { featureFlagsApi } from 'resources/feature-flags';

const ConfigurationRemoveModal = ({ opened, onClose, configurationId }) => {
  const deleteConfigurationMutation = featureFlagsApi.useDeleteConfiguration();

  const handleDelete = () => deleteConfigurationMutation.mutate({ configurationId }, {
    onSuccess: () => {
      onClose();
      showNotification({
        title: 'Success',
        message: 'Configuration has been successfully deleted.',
        color: 'green',
      });
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <Modal
      centered
      title={
        <Title order={3}>
          Delete the configuration?
        </Title>
      }
      opened={opened}
      onClose={onClose}
    >
        <Stack spacing={20}>
          <Group>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              color="red"
              loading={deleteConfigurationMutation.isLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Group>
        </Stack>
    </Modal>
)};

ConfigurationRemoveModal.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  configurationId: PropTypes.string.isRequired,
};

ConfigurationRemoveModal.defaultProps = {
  opened: false,
};

export default ConfigurationRemoveModal;
