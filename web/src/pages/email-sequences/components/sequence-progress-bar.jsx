import PropTypes from 'prop-types';
import { Group, Progress, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const SequenceProgressBar = ({ completed, total, dropped }) => {
  const matches = useMediaQuery('(max-width: 768px)');
  const convertedColor = '#734AB7';
  const droppedColor = '#AE8EE4';
  const mainColor = '#734AB7';

  const completedPercentage = (completed / total) * 100;
  const droppedPercentage = (dropped / total) * 100;

  const completedSection = { color: convertedColor, value: completedPercentage };
  const droppedSection = { color: droppedColor, value: droppedPercentage };
  const sections = [completedSection, droppedSection];

  return (
    <Stack spacing={matches ? 8 : 18}>
      <Progress sections={sections} size={8} color={mainColor} sx={{ backgroundColor: 'rgba(115, 74, 183, 0.2)' }} />
      <Group position="apart" px={4}>
        <Group spacing={0}>
          <Text size="sm">
            {`${completedPercentage.toFixed(0)}%,`}
            &nbsp;
          </Text>
          <Text weight="bold" size="sm">
            {completed}
          </Text>
        </Group>
        <Group spacing={0}>
          <Text size="sm">
            {`${droppedPercentage.toFixed(0)}%,`}
            &nbsp;
          </Text>
          <Text weight="bold" size="sm">
            {dropped}
          </Text>
        </Group>
        <Text size="sm">
          {total}
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
