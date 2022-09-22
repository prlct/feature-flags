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

const Settings = ({ featureId, env }) => {
  const growthFlags = useGrowthFlags();

  const { data: feature } = featureFlagApi.useGetById({ featureId, env });

  const isFeaturePercentOfUsersOn = growthFlags && growthFlags.isOn('percentOfUsers');

  return (
    <Stack sx={{ maxWidth: '520px' }}>
      <VisibilitySettings feature={feature} />

      <Stack>
        <Title order={4}>Info</Title>
        <FeatureFlagDescription feature={feature} />
      </Stack>

      <Text size="sm" mb={-16}>The settings below will only apply if the feature is enabled for some users</Text>
      <Divider my="sm" mt={0} />

      {isFeaturePercentOfUsersOn && (
      <PercentageSettings feature={feature} />
      )}

      <EmailsSettings feature={feature} />
    </Stack>
  );
};

Settings.propTypes = {
  featureId: PropTypes.string.isRequired,
  env: PropTypes.string.isRequired,
};

export default Settings;
