import { useCallback, useMemo } from 'react';
import { Textarea } from '@mantine/core';
import PropTypes, { string } from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import debounce from 'lodash/debounce';

import { handleError } from 'helpers';
import { featureFlagApi } from 'resources/feature-flag';

const schema = yup.object().shape({
  description: yup.string().trim().max(300),
});

const FeatureFlagDescription = ({ feature }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      description: feature.description,
    },
    resolver: yupResolver(schema),
  });

  const updateDescriptionMutation = featureFlagApi.useUpdateDescription();

  const onChange = useCallback((data) => {
    updateDescriptionMutation.mutate({ _id: feature._id, ...data }, {
      onError: (e) => handleError(e, setError),
    });
  }, [feature._id, setError, updateDescriptionMutation]);

  const onChangeDebounced = useMemo(
    () => debounce(handleSubmit(onChange), 1000),
    [onChange, handleSubmit],
  );

  return (
    <Textarea
      {...register('description', {
        onChange: onChangeDebounced,
      })}
      label="Description"
      placeholder="Enter a description"
      error={errors?.description?.message}
      sx={{ fontSize: '16px !important' }}
    />

  );
};

FeatureFlagDescription.propTypes = {
  feature: PropTypes.shape({
    _id: string,
    description: string,
  }).isRequired,
};

export default FeatureFlagDescription;
