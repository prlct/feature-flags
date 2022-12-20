import { Text, MediaQuery } from '@mantine/core';
import PropTypes from 'prop-types';

const MessagingText = (props) => {
  const { enabledForEveryone, usersPercentage, targetingRulesCount } = props;

  if (enabledForEveryone) {
    return (
      <MediaQuery
        query="(max-width: 768px)"
        styles={{ fontSize: 14 }}
      >
        <Text size="xs">For everyone</Text>
      </MediaQuery>
    );
  }

  return (
    <>
      {usersPercentage > 0
        && (
          <MediaQuery
            query="(max-width: 768px)"
            styles={{ fontSize: 14 }}
          >
            <Text size="xs">{`For ${usersPercentage}% of users`}</Text>
          </MediaQuery>
        )}
      {targetingRulesCount > 0 && (
        <MediaQuery
          query="(max-width: 768px)"
          styles={{ fontSize: 14 }}
        >
          <Text size="xs">For some users</Text>
        </MediaQuery>
      ) }
    </>
  );
};

MessagingText.propTypes = {
  enabledForEveryone: PropTypes.bool.isRequired,
  usersPercentage: PropTypes.number,
  targetingRulesCount: PropTypes.number,
};

MessagingText.defaultProps = {
  usersPercentage: 0,
  targetingRulesCount: 0,
};

export default MessagingText;
