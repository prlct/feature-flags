import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import trim from 'lodash/trim';
import {
  Title,
  Text,
  Divider,
  Stack,
  JsonInput,
} from '@mantine/core';
import { featureFlagApi } from 'resources/feature-flag';

import { useGrowthFlags } from 'contexts/growth-flags-context';
import VisibilitySettings from '../visibility-settings';
import PercentageSettings from '../percentage-settings';
import FeatureFlagDescription from '../feature-flag-description';
import FeatureTargetingRules from '../feature-targeting-rules';

const CONFIG_SAVE_DEBOUNCE_TIME = 500;

const Settings = ({ featureId, env }) => {
  const growthFlags = useGrowthFlags();

  const { data: feature } = featureFlagApi.useGetById({ featureId, env });

  const [remoteConfig, setRemoteConfig] = useState(feature.remoteConfig);

  useEffect(() => {
    setRemoteConfig(feature.remoteConfig);
  }, [feature]);

  const isFeaturePercentOfUsersOn = growthFlags && growthFlags.isOn('percentOfUsers');
  const isTargetingUsersOn = growthFlags && growthFlags.isOn('targetingRules');
  const isRemoteConfigOn = growthFlags && growthFlags.isOn('remoteConfig');

  const updateRemoteConfigMutation = featureFlagApi.useUpdateRemoteConfig();

  const debounceConfigSave = useMemo(() => debounce(() => updateRemoteConfigMutation.mutate({
    env, featureId, remoteConfig,
  }), CONFIG_SAVE_DEBOUNCE_TIME), [env, featureId, remoteConfig, updateRemoteConfigMutation]);

  const onRemoteConfigBlurHandler = () => {
    if (trim(remoteConfig) === trim(feature.remoteConfig)) {
      return null;
    }
    return debounceConfigSave();
  };

  const defaultLabel = 'JSON configuration';
  const remoteConfigLabel = growthFlags && JSON.parse(growthFlags.getConfig('remoteConfig'))?.textAreaLabel;

  return (
    <Stack spacing={24}>
      <Stack spacing={24} sx={{ maxWidth: '650px' }}>
        <VisibilitySettings feature={feature} />

        {isRemoteConfigOn && (
          <Stack>
            <JsonInput
              label={remoteConfigLabel || defaultLabel}
              placeholder='{ "color": "blue" }'
              validationError="Invalid JSON format"
              formatOnBlur
              onBlur={onRemoteConfigBlurHandler}
              autosize
              minRows={4}
              value={remoteConfig}
              onChange={setRemoteConfig}
            />
          </Stack>
        )}

        <Stack spacing="sm">
          <Title order={4}>Info</Title>
          <FeatureFlagDescription feature={feature} />
        </Stack>

        <Text size="sm" mb={-16}>The settings below will only apply if the feature is enabled for some users</Text>
        <Divider my="sm" mt={0} />

        {isFeaturePercentOfUsersOn && (
          <PercentageSettings feature={feature} />
        )}

      </Stack>

      {isTargetingUsersOn && (
        <FeatureTargetingRules
          feature={feature}
          sx={{ maxWidth: '1000px' }}
        />
      )}
    </Stack>
  );
};

Settings.propTypes = {
  featureId: PropTypes.string.isRequired,
  env: PropTypes.string.isRequired,
};

export default Settings;
