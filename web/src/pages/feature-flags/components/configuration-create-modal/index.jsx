import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Modal,
  Button,
  Stack,
  Title,
  JsonInput, TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { handleError } from 'helpers';
import { featureFlagApi } from 'resources/feature-flag';

const schema = yup.object().shape({
  description: yup.string().max(64),
  config: yup.string().max(500),
});

const VariantCreateModal = ({
  opened,
  onClose,
  configurationId,
  configuration: propsConfiguration,
  description: propsDescription,
}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [configuration, setConfiguration] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (opened && configurationId) {
      setConfiguration(propsConfiguration);
      setDescription(propsDescription);
    }
  }, [configurationId, opened, propsConfiguration, propsDescription]);

  const handleClose = useCallback(() => {
    setConfiguration('');
    setDescription('');
    onClose();
    reset();
  }, [reset, onClose]);

  const createConfigurationMutation = featureFlagApi.useCreateConfiguration();

  const onSubmit = () => createConfigurationMutation
    .mutate({ configurationId, configuration, description }, {
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
      onError: (e) => handleError(e, setError),
    });

  return (
    <Modal
      centered
      title={(
        <Title order={3}>
          {configurationId ? 'Edit configuration' : 'Create configuration'}
        </Title>
      )}
      opened={opened}
      onClose={handleClose}
    >
      <Stack spacing={20}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            {...register('description')}
            label="Variant description"
            placeholder="Some short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors?.description?.message}
          />

          <JsonInput
            {...register('config')}
            name="config"
            label="JSON configuration"
            placeholder="Enter a JSON configuration"
            validationError="Invalid JSON format"
            formatOnBlur
            autosize
            minRows={4}
            value={configuration}
            onChange={setConfiguration}
            error={errors?.config?.message}
          />

          <Button
            type="submit"
            loading={createConfigurationMutation.isLoading}
          >
            {configurationId ? 'Edit' : 'Create'}
          </Button>
        </form>
      </Stack>
    </Modal>
  );
};

VariantCreateModal.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  configurationId: PropTypes.string,
  configuration: PropTypes.string,
  description: PropTypes.string,
};

VariantCreateModal.defaultProps = {
  opened: false,
  configurationId: '',
  configuration: '',
  description: '',
};

export default VariantCreateModal;
