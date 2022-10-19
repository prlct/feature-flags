import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import trim from 'lodash/trim';

import { Stack, TextInput } from '@mantine/core';

import { featureFlagApi } from 'resources/feature-flag';

import RemoteConfig from '../remote-config';

const ABVariant = (props) => {
  const { feature, env, variantIndex } = props;

  const [name, setName] = useState('');

  useEffect(() => {
    setName(feature.tests[variantIndex].name);
  }, [feature.tests, variantIndex]);

  const updateVariantMutation = featureFlagApi.useUpdateABVariant(feature._id);

  const debouncedUpdateVariant = useMemo(
    () => debounce(({
      env,
      remoteConfig = feature.tests[variantIndex].remoteConfig,
    }) => updateVariantMutation.mutate({
      env, name, remoteConfig, variantIndex,
    }), 500),
    [feature.tests, name, updateVariantMutation, variantIndex],
  );

  const onNameBlurHandler = () => {
    if (trim(name) === trim(feature.tests[variantIndex].name)) {
      return null;
    }

    return debouncedUpdateVariant({ env });
  };

  return (
    <Stack>
      <TextInput
        label="Variant name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={onNameBlurHandler}
      />
      <RemoteConfig
        feature={feature}
        env={env}
        initialRemoteConfig={feature.tests[variantIndex].remoteConfig}
        configSaveHandler={debouncedUpdateVariant}
      />
    </Stack>
  );
};

ABVariant.propTypes = {
  feature: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    remoteConfig: PropTypes.string,
    tests: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      remoteConfig: PropTypes.string,
    })).isRequired,
  }).isRequired,
  env: PropTypes.string.isRequired,
  variantIndex: PropTypes.number.isRequired,
};

export default ABVariant;
