import { useCallback, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Title,
  Stack,
  Select,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { featureFlagApi } from 'resources/feature-flag';
import { handleError } from 'helpers';

export const percentageSelectList = [
  { value: '5', label: '5%' },
  { value: '10', label: '10%' },
  { value: '15', label: '15%' },
  { value: '20', label: '20%' },
  { value: '25', label: '25%' },
  { value: '30', label: '30%' },
  { value: '40', label: '40%' },
  { value: '50', label: '50%' },
  { value: '60', label: '60%' },
  { value: '70', label: '70%' },
  { value: '80', label: '80%' },
  { value: '90', label: '90%' },
];

const PercentageSettings = ({ feature }) => {
  const [usersPercentageValue, setUsersPercentageValue] = useState('');
  useEffect(() => {
    setUsersPercentageValue((feature?.usersPercentage || '').toString());
  }, [feature?.usersPercentage]);

  const changeUsersPercentageMutation = featureFlagApi.useChangeUsersPercentage();

  const handleUsersPercentageChange = useCallback((percentage) => changeUsersPercentageMutation.mutate({
    _id: feature._id,
    percentage: parseInt(percentage, 10),
    env: feature.env,
  }, {
    onSuccess: ({ usersPercentage }) => {
      showNotification({
        title: 'Success',
        message: `The feature will be displayed for ${usersPercentage || 0} percent of users.`,
        color: 'green',
      });
    },
    onError: (e) => handleError(e),
  }), [changeUsersPercentageMutation, feature?._id, feature?.env]);

  return (
    <Stack sx={{ maxWidth: '200px' }}>
      <Select
        label={
          <Title order={4}>Percentage of users</Title>
    }
        placeholder="Select a percentage"
        clearable
        value={usersPercentageValue}
        data={percentageSelectList}
        disabled={feature.enabledForEveryone}
        onChange={handleUsersPercentageChange}
      />
    </Stack>
  );
};

PercentageSettings.propTypes = {
  feature: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    env: PropTypes.string,
    enabled: PropTypes.bool,
    enabledForEveryone: PropTypes.bool,
    usersPercentage: PropTypes.number,
  }).isRequired,
};

export default PercentageSettings;
