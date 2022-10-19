import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import trim from 'lodash/trim';

import { Anchor, JsonInput, Stack } from '@mantine/core';

const RemoteConfig = (props) => {
  const { feature, env, configSaveHandler, initialRemoteConfig } = props;
  const [remoteConfig, setRemoteConfig] = useState(feature.remoteConfig);

  useEffect(() => {
    setRemoteConfig(initialRemoteConfig);
  }, [initialRemoteConfig, feature.tests]);

  const onRemoteConfigBlurHandler = () => {
    if (trim(remoteConfig) === trim(feature.remoteConfig)) {
      return null;
    }
    return configSaveHandler({ env, featureId: feature._id, remoteConfig });
  };

  return (
    <Stack spacing="xs">
      <JsonInput
        label="Remote config"
        placeholder='{ "color": "blue" }'
        validationError="Invalid JSON format"
        formatOnBlur
        onBlur={onRemoteConfigBlurHandler}
        autosize
        minRows={4}
        value={remoteConfig}
        onChange={setRemoteConfig}
      />
      <Anchor href="https://developer.growthflags.com/sdk-api/getFeature" target="_blank" size="xs">Learn more how to use remote config.</Anchor>
    </Stack>
  );
};

RemoteConfig.propTypes = {
  feature: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    remoteConfig: PropTypes.string,
    tests: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      remoteConfig: PropTypes.string,
    })).isRequired,
  }).isRequired,
  env: PropTypes.string.isRequired,
  initialRemoteConfig: PropTypes.string.isRequired,
  configSaveHandler: PropTypes.func.isRequired,
};

export default RemoteConfig;
