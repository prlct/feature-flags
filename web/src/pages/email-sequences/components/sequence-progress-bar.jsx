import PropTypes from 'prop-types';
import { Group, Progress, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const SequenceProgressBar = ({ total, dropped }) => {
  const percentage = 100 - ((100 * dropped) / total);
  const matches = useMediaQuery('(max-width: 768px)');

  return (
    <Stack spacing={matches ? 8 : 18}>
      <Progress value={percentage} size={4} color="#734AB7" sx={{ backgroundColor: 'rgba(115, 74, 183, 0.2)' }} />
      <Group position="apart" px={4}>
        <Text size="sm" sx={(theme) => ({ color: theme.colors.gray[4] })}>
          {`Converted: ${total - dropped}`}
        </Text>
        <Text size="sm" sx={(theme) => ({ color: theme.colors.gray[4] })}>
          {`Dropped: ${dropped}`}
        </Text>
      </Group>
    </Stack>
  );
};

SequenceProgressBar.propTypes = {
  total: PropTypes.number.isRequired,
  dropped: PropTypes.number.isRequired,
};

export default SequenceProgressBar;
