import { PropTypes } from 'prop-types';
import {
  Title,
  Text,
  Divider,
  Stack,
} from '@mantine/core';
import { featureFlagApi } from 'resources/feature-flag';
import { useGrowthFlags } from 'contexts/growth-flags-context';

import VisibilitySettings from '../visibility-settings';
import EmailsSettings from '../emails-settings';
import PercentageSettings from '../percentage-settings';
import FeatureFlagDescription from '../feature-flag-description';
import FeatureTargetingRules from '../feature-targeting-rules';

const Settings = ({ featureId, env }) => {
  const growthFlags = useGrowthFlags();

  const { data: feature } = featureFlagApi.useGetById({ featureId, env });

  const isFeaturePercentOfUsersOn = growthFlags && growthFlags.isOn('percentOfUsers');
  const isTargetingUsersOn = growthFlags && growthFlags.isOn('targetingRules');

  return (
    <Stack spacing={24}>
      <Stack spacing={24} sx={{ maxWidth: '650px' }}>
        <VisibilitySettings feature={feature} />

        <Stack spacing="sm">
          <Title order={4}>Info</Title>
          <FeatureFlagDescription feature={feature} />
        </Stack>

        <Text size="sm" mb={-16}>The settings below will only apply if the feature is enabled for some users</Text>
        <Divider my="sm" mt={0} />

        {isFeaturePercentOfUsersOn && (
        <PercentageSettings feature={feature} />
        )}

        {!isTargetingUsersOn && (<EmailsSettings feature={feature} />)}
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
