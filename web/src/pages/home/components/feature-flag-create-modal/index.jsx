import { useCallback } from 'react';
import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Stack,
  Title,
} from '@mantine/core';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import * as yup from 'yup';

import { handleError } from 'helpers';
import { applicationApi } from 'resources/application';
import { useAmplitude } from 'contexts/amplitude-context';
import { useGrowthFlags } from 'contexts/growth-flags-context';

const schema = yup.object().shape({
  name: yup.string().trim().max(100).required('Field is required.'),
  description: yup.string().trim().max(300),
});

const FeatureFlagCreateModal = ({ opened, onClose }) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const amplitude = useAmplitude();
  const growthflags = useGrowthFlags();

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const createFeatureFlagMutation = applicationApi.useCreateFeatureFlag();

  const onSubmit = (data) => createFeatureFlagMutation.mutate(data, {
    onSuccess: (result) => {
      handleClose();
      showNotification({
        title: 'Success',
        message: 'New feature flag has been successfully created.',
        color: 'green',
      });
      amplitude.track('Create feature flag');
      if (result.isFirst) {
        growthflags?.triggerEvent('feature-flag-created');
      }
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <Modal
      centered
      title={(
        <Title order={3}>
          Create feature flag
        </Title>
      )}
      opened={opened}
      onClose={handleClose}
    >
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={20}>
        <TextInput
          {...register('name')}
          label="Name"
          placeholder="Enter a name"
          error={errors?.name?.message}
        />
        <Textarea
          {...register('description')}
          label="Description"
          placeholder="Enter a description"
          error={errors?.description?.message}
          sx={{ fontSize: '16px !important' }}
        />
        <Button
          type="submit"
          loading={createFeatureFlagMutation.isLoading}
        >
          Create
        </Button>
      </Stack>
    </Modal>
  );
};

FeatureFlagCreateModal.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

FeatureFlagCreateModal.defaultProps = {
  opened: false,
};

export default FeatureFlagCreateModal;
