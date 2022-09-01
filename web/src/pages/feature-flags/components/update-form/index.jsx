import {
  Button,
  Textarea,
  Stack,
} from '@mantine/core';
import PropTypes, { string } from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import * as yup from 'yup';

import { handleError } from 'helpers';
import { featureFlagApi } from 'resources/feature-flag';

const schema = yup.object().shape({
  description: yup.string().trim().max(300),
});

const FeatureFlagUpdateForm = ({ featureFlag }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: featureFlag.description,
    },
    resolver: yupResolver(schema),
  });

  const updateFeatureFlagMutation = featureFlagApi.useUpdate();

  const onSubmit = (data) => {
    updateFeatureFlagMutation.mutate({ _id: featureFlag._id, ...data }, {
      onSuccess: () => {
        showNotification({
          title: 'Success',
          message: 'Feature flag has been successfully updated.',
          color: 'green',
        });
      },
      onError: (e) => handleError(e, setError),
    });
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={20}>
      <Textarea
        {...register('description')}
        label="Description"
        placeholder="Enter a description"
        error={errors?.description?.message}
        sx={{ fontSize: '16px !important' }}
      />
      <Button
        type="submit"
        loading={updateFeatureFlagMutation.isLoading}
        sx={{ alignSelf: 'flex-end' }}
      >
        Save
      </Button>
    </Stack>
  );
};

FeatureFlagUpdateForm.propTypes = {
  featureFlag: PropTypes.shape({
    _id: string,
    description: string,
  }).isRequired,
};

export default FeatureFlagUpdateForm;
