import { useCallback } from 'react';
import {
  Modal,
  Button,
  TextInput,
  Stack,
  Title,
} from '@mantine/core';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { handleError } from 'helpers';
import { useAddApplicationEvent } from 'resources/email-sequence/email-sequence.api';

const schema = yup.object().shape({
  name: yup.string().trim().max(100).required('Field is required.'),
  key: yup.string().trim().max(100).required('Field is required.'),
});

const EventCreateModal = ({ opened, onClose }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    mutate: createApplicationEvent,
    isLoading: isLoadingEvent,
  } = useAddApplicationEvent();

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const onSubmit = (data) => {
    createApplicationEvent({ label: data.name, value: data.key }, {
      onSuccess: () => {
        handleClose();
      },
      onError: (e) => handleError(e, setError),
    });
  };

  return (
    <Modal
      centered
      title={(
        <Title order={3}>
          Create trigger event
        </Title>
      )}
      opened={opened}
      onClose={handleClose}
    >
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={20}>
        <TextInput
          {...register('name')}
          label="Event name"
          placeholder="Enter a event name"
          error={errors?.name?.message}
        />
        <TextInput
          {...register('key')}
          label="Event key"
          placeholder="Enter a event key"
          error={errors?.key?.message}
        />
        <Button
          type="submit"
          loading={isLoadingEvent}
        >
          Create
        </Button>
      </Stack>
    </Modal>
  );
};

EventCreateModal.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

EventCreateModal.defaultProps = {
  opened: false,
};

export default EventCreateModal;
