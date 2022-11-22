import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Text } from '@mantine/core';

import { useAmplitude } from 'contexts/amplitude-context';
import { useGetFeatureHistory } from 'resources/feature-flag/feature-flag.api';

const getActionMessage = (data) => {
  if (data.enabled === false) {
    return 'Disabled';
  }
  if (data.enabled === true) {
    let message = 'Enabled';
    if (data.enabledForEveryone === true) {
      message = `${message} for everyone`;
      return message;
    }

    if (data.usersPercentage !== undefined && data.usersPercentage > 0) {
      message = `${message} for ${data.usersPercentage}% users`;
      return message;
    }

    if (data.enabledForEveryone !== true) {
      message = `${message} for some users`;
    }
    return message;
  }

  const changesMap = {
    usersPercentage: 'Edited default coverage',
    tests: 'Edited a/b settings',
    targetingRules: 'Edited targeting rules',
    remoteConfig: 'Edited remote config',
  };

  return Object.keys(data).map((key) => changesMap[key]).join(', ');
};

const History = ({ featureId, env }) => {
  const { data: history } = useGetFeatureHistory(featureId, env);

  const amplitude = useAmplitude();

  const getDate = (date) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    .format(new Date(date));

  useEffect(() => {
    amplitude.track('View history');
  }, [amplitude]);

  if (!history?.length) {
    return <Text mt={20}>There is no history yet.</Text>;
  }

  return (
    <Table mt={20}>
      <thead>
        <tr>
          <th>Action</th>
          <th>Changed By</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {history?.map((historyRecord) => (
          <tr key={historyRecord.changedOn.toString()}>
            <td style={{ width: '50%' }}>
              <Text>{getActionMessage(historyRecord.data)}</Text>
            </td>
            <td style={{ width: '25%' }}>
              <Text>{historyRecord.admin.email}</Text>
            </td>
            <td style={{ width: '25%' }}>
              <Text>{getDate(historyRecord.changedOn.toString())}</Text>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

History.propTypes = {
  env: PropTypes.string.isRequired,
  featureId: PropTypes.string.isRequired,
};

export default History;
