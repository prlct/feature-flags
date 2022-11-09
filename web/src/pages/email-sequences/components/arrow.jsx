import PropTypes from 'prop-types';

import { Center, Group, Text } from '@mantine/core';
import { IconArrowDown } from '@tabler/icons';

const Arrow = ({ days }) => (
  <Center>
    <Group>
      <IconArrowDown />
      <Text>
        {days && `${days} days`}
      </Text>
    </Group>
  </Center>
);

Arrow.propTypes = {
  days: PropTypes.number,
};

Arrow.defaultProps = {
  days: 0,
};

export default Arrow;
