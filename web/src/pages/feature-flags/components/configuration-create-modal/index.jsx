import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Stack,
  Title,
  JsonInput,
} from '@mantine/core';
import PropTypes from 'prop-types';
import { showNotification } from '@mantine/notifications';

import { handleError } from 'helpers';
import { featureFlagApi } from 'resources/feature-flag';

const ConfigurationCreateModal = ({
  opened,
  onClose,
  configurationId,
  configuration: propsConfiguration,
}) => {
  const [configuration, setConfiguration] = useState('');

  useEffect(() => {
    if (opened && configurationId) {
      setConfiguration(propsConfiguration);
    }
  }, [configurationId, opened]);

  const handleClose = useCallback(() => {
    setConfiguration('');
    onClose();
  }, []);

  const createConfigurationMutation = featureFlagApi.useCreateConfiguration();

  const onSubmit = () => createConfigurationMutation.mutate({ configurationId, configuration }, {
    onSuccess: () => {
      handleClose();
      const message = configurationId
        ? 'Configuration has been successfully changed'
        : 'New configuration has been successfully created.';

      showNotification({
        title: 'Success',
        message,
        color: 'green',
      });
    },
    onError: (e) => handleError(e),
  });

  return (
    <Modal
      centered
      title={
        <Title order={3}>
          {configurationId ? 'Edit configuration' : 'Create configuration'}
        </Title>
      }
      opened={opened}
      onClose={handleClose}
    >
        <Stack spacing={20}>
          {/* TODO: Using of JsonInput with react-hook-form leads to TypeError: Cannot read properties of undefined (reading 'name') */}
          <JsonInput
            label="JSON configuration"
            placeholder="Enter a JSON configuration"
            validationError="Invalid JSON format"
            formatOnBlur
            autosize
            minRows={4}
            value={configuration}
            onChange={setConfiguration}
          />
          <Button
            onClick={onSubmit}
            loading={createConfigurationMutation.isLoading}
          >
            {configurationId ? 'Edit' : 'Create'}
          </Button>
        </Stack>
    </Modal>
)};

ConfigurationCreateModal.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  configurationId: PropTypes.string,
  configuration: PropTypes.string,
};

ConfigurationCreateModal.defaultProps = {
  opened: false,
  configurationId: '',
  configuration: '',
};

export default ConfigurationCreateModal;
