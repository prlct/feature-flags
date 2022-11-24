import PropTypes from 'prop-types';

import { Center, Group, Text } from '@mantine/core';

const DayBadge = ({ days }) => (
  <Center>
    <Group style={{
      backgroundColor: '#CEF2CE',
      position: 'absolute',
      zIndex: 99,
      top: 0,
      left: 20,
      minWidth: 60,
      borderRadius: 8,
      justifyContent: 'center',
      padding: '4px 8px',
    }}
    >
      <Text
        size={12}
        weight={500}
        style={{ lineHeight: '18px' }}
        sx={(theme) => ({
          color: theme.colors.gray[9],
        })}
      >
        {days && `${days} days`}
      </Text>
    </Group>
  </Center>
);

DayBadge.propTypes = {
  days: PropTypes.number,
};

DayBadge.defaultProps = {
  days: 0,
};

export default DayBadge;
