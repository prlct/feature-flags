import {
  Button,
  TextInput,
  Stack,
  Group,
} from '@mantine/core';
import PropTypes from 'prop-types';

import { useUpdateApplicationEvent } from 'resources/email-sequence/email-sequence.api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().trim().max(100).required('Field is required.'),
  key: yup.string().trim().max(100).required('Field is required.'),
});

const EventSettingModal = ({ context, id, innerProps }) => {
  const { label, value } = innerProps;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    mutate: updateApplicationEvent,
    isLoading: isLoadingEvent,
  } = useUpdateApplicationEvent();

  const onSubmit = (data) => {
    const event = innerProps;
    const updatedEvent = { label: data.name, value: data.key };
    updateApplicationEvent({ updatedEvent, event }, {
      onSuccess: () => context.closeModal(id),
    });
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={20}>
      <TextInput
        {...register('name', { value: label })}
        label="Event name"
        placeholder="Enter a event name"
        error={errors?.name?.message}
      />
      <TextInput
        {...register('key', { value })}
        label="Event key"
        placeholder="Enter a event key"
        error={errors?.key?.message}
      />
      <Group position="right">
        <Button variant="subtle" onClick={() => context.closeModal(id)}>Cancel</Button>
        <Button
          type="submit"
          loading={isLoadingEvent}
        >
          Update
        </Button>
      </Group>

    </Stack>
  );
};

EventSettingModal.propTypes = {
  context: PropTypes.shape({
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  innerProps: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default EventSettingModal;
