import { useCallback } from 'react';
import { PropTypes } from 'prop-types';
import {
  Title,
  Stack,
  Switch,
  Select,
  Group,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { handleError } from 'helpers';
import { featureFlagApi } from 'resources/feature-flag';

const VisibilitySettings = ({ feature }) => {
  const changeFeatureVisibilityMutation = featureFlagApi.useChangeFeatureVisibility();

  const handleFeatureVisibilityChange = useCallback((visibility) => {
    const enabledForEveryone = visibility === 'everyone';
    const reqData = {
      _id: feature._id,
      enabledForEveryone,
      env: feature.env,
    };

    return changeFeatureVisibilityMutation.mutate(reqData, {
      onSuccess: (updatedFeature) => {
        if (!updatedFeature.enabled) {
          return;
        }

        if (visibility === 'everyone') {
          showNotification({
            title: 'Success',
            message: `Feature ${feature.name} is now visible for all users.`,
            color: 'green',
          });
        }

        if (visibility === 'group') {
          showNotification({
            title: 'Success',
            message: `Feature ${feature.name} is now visible only for some users.`,
            color: 'green',
          });
        }
      },
      onError: (e) => handleError(e),
    });
  }, [
    changeFeatureVisibilityMutation,
    feature?._id,
    feature?.env,
    feature?.name,
  ]);

  return (
    <Group position="apart" align="flex-end">
      <Stack sx={{ maxWidth: '200px' }}>
        <Select
          label={
            <Title order={4}>Enable for</Title>
          }
          placeholder="Choose for whom to show the feature"
          value={feature.enabledForEveryone ? 'everyone' : 'group'}
          data={[
            { value: 'everyone', label: 'All users' },
            { value: 'group', label: 'Some users' },
          ]}
          onChange={handleFeatureVisibilityChange}
        />
      </Stack>
    </Group>
  );
};

VisibilitySettings.propTypes = {
  feature: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    env: PropTypes.string,
    enabled: PropTypes.bool,
    enabledForEveryone: PropTypes.bool,
  }).isRequired,
};

export default VisibilitySettings;
