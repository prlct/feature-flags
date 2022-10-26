import PropTypes from 'prop-types';

import { Table, Text } from '@mantine/core';

const changesMap = {
  enabled: 'Feature toggle',
  enabledForEveryone: 'Enabled for everyone toggle',
  usersPercentage: 'Percentage value',
  tests: 'Variants settings',
  targetingRules: 'Targeting rules',
  remoteConfig: 'Remote config',
};

const History = ({ feature }) => {
  const renderDataChanges = (data) => (
    Object.keys(data)
      .map((key) => changesMap[key] || key)
      .map((text) => <Text>{text}</Text>)
  );

  const getDate = (date) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    .format(new Date(date));

  return (
    <Table>
      <thead>
        <tr>
          <th>Environment</th>
          <th>Changed on</th>
          <th>Changes</th>
          <th>Admin</th>
        </tr>
      </thead>
      <tbody>
        {feature?.history?.map((historyRecord) => (
          <tr>
            <td>
              <Text>{historyRecord.env}</Text>
            </td>
            <td>
              <Text>{getDate(historyRecord.changedOn)}</Text>
            </td>
            <td>
              <Text>{renderDataChanges(historyRecord.data)}</Text>
            </td>
            <td>
              <Text>{historyRecord.admin.email}</Text>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

History.propTypes = {
  feature: PropTypes.shape({
    history: PropTypes.arrayOf(PropTypes.shape({
      env: PropTypes.string,
      changedOn: PropTypes.string,
      data: PropTypes.shape({}),
    })),
  }).isRequired,
};

export default History;
