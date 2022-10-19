import { Text } from '@mantine/core';
import PropTypes from 'prop-types';

const MessagingText = (props) => {
  const { enabledForEveryone, usersPercentage, targetingRulesCount } = props;

  if (enabledForEveryone) {
    return <Text size="xs">For everyone</Text>;
  }

  return (
    <>
      {usersPercentage > 0
        && <Text size="xs">{`For ${usersPercentage}% of users`}</Text>}
      {targetingRulesCount > 0 && <Text size="xs">For some users</Text>}
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
