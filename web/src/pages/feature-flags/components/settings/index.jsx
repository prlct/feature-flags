import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import {
  Title,
  Text,
  Divider,
  Stack,
  Tabs,
} from '@mantine/core';

import { featureFlagApi } from 'resources/feature-flag';
import { getLetterByAlphabetNumber } from 'helpers';
import { useGrowthFlags } from 'contexts/growth-flags-context';
import { useAmplitude } from 'contexts/amplitude-context';

import VisibilitySettings from '../visibility-settings';
import PercentageSettings from '../percentage-settings';
import FeatureFlagDescription from '../feature-flag-description';
import FeatureTargetingRules from '../feature-targeting-rules';
import RemoteConfig from '../remote-config';
import ABVariant from '../ab-variant';

const MAX_AB_VARIANTS = 3;
const CONFIG_SAVE_DEBOUNCE_TIME = 500;

const Settings = ({ feature, env }) => {
  const growthFlags = useGrowthFlags();
  const amplitude = useAmplitude();

  const [openedVariant, setOpenedVariant] = useState('mainVariant');

  useEffect(() => {
    if (feature.tests.length === 0) {
      setOpenedVariant('mainVariant');
    }
  }, [feature.tests.length]);

  const isFeaturePercentOfUsersOn = growthFlags && growthFlags.isOn('percentOfUsers');
  const isTargetingUsersOn = growthFlags && growthFlags.isOn('targetingRules');
  const isABTestingOn = growthFlags && growthFlags.isOn('abTesting');

  const createABVariantMutation = featureFlagApi.useCreateABVariant(feature._id);
  const updateRemoteConfigMutation = featureFlagApi.useUpdateRemoteConfig();

  const debouncedRemoteConfigSave = useMemo(
    () => debounce(({ env, featureId, remoteConfig }) => updateRemoteConfigMutation.mutate(
      {
        env, featureId, remoteConfig,
      },
      {
        onSuccess: () => {
          amplitude.track('Add remote config', { env });
        },
      },
    ), CONFIG_SAVE_DEBOUNCE_TIME),
    [amplitude, updateRemoteConfigMutation],
  );

  const handleAddVariant = async () => {
    const totalExtraVariants = feature.tests?.length || 0;
    const newVariantName = `Variant ${getLetterByAlphabetNumber(totalExtraVariants + 1).toUpperCase()}`;
    await createABVariantMutation.mutate({ name: newVariantName, remoteConfig: '', env }, { onSuccess: () => amplitude.track('Add a/b testing', { env }),
    });
    setOpenedVariant(totalExtraVariants.toString());
  };

  return (
    <Stack spacing={24}>
      <Stack spacing={24} sx={{ maxWidth: '800px' }}>
        <VisibilitySettings feature={feature} />

        <Stack spacing="sm">
          <Title order={4}>Info</Title>
          <FeatureFlagDescription feature={feature} />
        </Stack>

        <Text size="sm" mt={16} mb={-16}>The settings below will only apply if the feature is enabled for some users</Text>
        <Divider my="sm" mt={0} />

        {isFeaturePercentOfUsersOn && (
          <PercentageSettings feature={feature} />
        )}

        {isTargetingUsersOn && (
          <FeatureTargetingRules
            feature={feature}
            sx={{ maxWidth: '1000px' }}
          />
        )}

        <Divider my="sm" mt={0} />

        <Tabs defaultValue="mainVariant" value={openedVariant} onTabChange={setOpenedVariant} keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="mainVariant">
              Basic
            </Tabs.Tab>
            {isABTestingOn && feature?.tests?.map((variant, index) => (
              <Tabs.Tab key={variant.name} value={index.toString()}>
                {variant.name}
              </Tabs.Tab>
            ))}
            {isABTestingOn && (
              <Tabs.Tab value="Add new" onClick={handleAddVariant} disabled={feature?.tests?.length >= MAX_AB_VARIANTS}>
                <Text color="blue">
                  Add New
                </Text>
              </Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel value="mainVariant" mt={8}>
            <RemoteConfig
              feature={feature}
              env={env}
              configSaveHandler={debouncedRemoteConfigSave}
              initialRemoteConfig={feature.remoteConfig}
            />
          </Tabs.Panel>

          {isABTestingOn && feature?.tests?.map((variant, index) => (
            <Tabs.Panel key={variant.name} value={index.toString()} mt={8}>
              <ABVariant
                feature={feature}
                env={env}
                variantIndex={index}
                setOpenedVariant={setOpenedVariant}
              />
            </Tabs.Panel>
          ))}

        </Tabs>
      </Stack>

    </Stack>
  );
};

Settings.propTypes = {
  feature: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    remoteConfig: PropTypes.string,
    tests: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      remoteConfig: PropTypes.string,
    })).isRequired,
  }).isRequired,
  env: PropTypes.string.isRequired,
};

export default Settings;
