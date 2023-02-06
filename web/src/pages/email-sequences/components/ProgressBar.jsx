import PropTypes from 'prop-types';

import { Box, Group, Progress, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMemo } from 'react';

const DoubleSectionProgressBar = (props) => {
  const {
    primaryCount,
    secondaryCount,
    total,
    primaryColor,
    secondaryColor,
    totalColor,
    primaryText,
    secondaryText,
    totalText,
    isCompact,
  } = props;
  const matches = useMediaQuery('(max-width: 768px)');

  const primaryPercentage = useMemo(
    () => ((primaryCount / total) * 100 || 0),
    [primaryCount, total],
  );
  const secondaryPercentage = useMemo(
    () => ((secondaryCount / total) * 100) || 0,
    [secondaryCount, total],
  );

  const sections = useMemo(
    () => [
      { color: primaryColor, value: primaryPercentage },
      { color: secondaryColor, value: secondaryPercentage }],
    [primaryColor, primaryPercentage, secondaryColor, secondaryPercentage],
  );

  const renderLegendCircle = (color) => (
    <div
      style={{ width: 8, height: 8, marginRight: 6, backgroundColor: color, borderRadius: 8 }}
    />
  );

  return (
    <Stack spacing={matches ? 8 : 18}>
      <Progress sections={sections} size={8} color={totalColor} sx={{ backgroundColor: 'rgba(115, 74, 183, 0.2)' }} />
      <Box sx={{ display: 'flex', flexDirection: isCompact ? 'row' : 'column', justifyContent: isCompact ? 'space-between' : 'unset' }}>
        <Group spacing={4}>
          {renderLegendCircle(primaryColor)}
          {!isCompact ? primaryText : null}
          <Text size="sm">
            {`${primaryPercentage.toFixed(0)}%,`}
          </Text>
          <Text weight="bold" size="sm">
            {primaryCount}
          </Text>
        </Group>
        <Group spacing={4}>
          {renderLegendCircle(secondaryColor)}
          {!isCompact ? secondaryText : null}
          <Text size="sm">
            {`${secondaryPercentage.toFixed(0)}%,`}
          </Text>
          <Text weight="bold" size="sm">
            {secondaryCount}
          </Text>
        </Group>
        <Group spacing={4}>
          {renderLegendCircle(totalColor)}
          {!isCompact ? totalText : null}
          <Text size="sm" weight={600}>
            {total}
          </Text>
        </Group>
      </Box>
    </Stack>
  );
};

DoubleSectionProgressBar.propTypes = {
  primaryCount: PropTypes.number.isRequired,
  secondaryCount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
  totalColor: PropTypes.string,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  totalText: PropTypes.string,
  isCompact: PropTypes.bool,
};

DoubleSectionProgressBar.defaultProps = {
  primaryColor: '#734AB7',
  secondaryColor: '#AE8EE4',
  totalColor: '#E3DBF1',
  isCompact: true,
  primaryText: '',
  secondaryText: '',
  totalText: '',
};

export default DoubleSectionProgressBar;
