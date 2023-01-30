import PropTypes from 'prop-types';
import { Group, Progress, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const SequenceProgressBar = ({ completed, total, dropped }) => {
  const matches = useMediaQuery('(max-width: 768px)');
  const completedSection = { color: 'green', value: (completed / total) * 100 };
  const droppedSection = { color: 'red', value: (dropped / total) * 100 };
  const sections = [completedSection, droppedSection];

  return (
    <Stack spacing={matches ? 8 : 18}>
      <Progress sections={sections} size={4} color="#734AB7" sx={{ backgroundColor: 'rgba(115, 74, 183, 0.2)' }} />
      <Group position="apart" px={4}>
        <Text size="sm" sx={(theme) => ({ color: theme.colors.gray[4] })}>
          {`Converted: ${completed}`}
        </Text>
        <Text size="sm" sx={(theme) => ({ color: theme.colors.gray[4] })}>
          {`Dropped: ${dropped}`}
        </Text>
        <Text size="sm" sx={(theme) => ({ color: theme.colors.gray[4] })}>
          {`Total: ${total}`}
        </Text>
      </Group>
    </Stack>
  );
};

SequenceProgressBar.propTypes = {
  total: PropTypes.number.isRequired,
  completed: PropTypes.number.isRequired,
  dropped: PropTypes.number.isRequired,
};

export default SequenceProgressBar;
