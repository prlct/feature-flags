import PropTypes from 'prop-types';

import { Box, Group, Progress, Stack, Text, Tooltip } from '@mantine/core';
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
    tooltips,
  } = props;
  const matches = useMediaQuery('(max-width: 768px)');

  const primaryPercentage = useMemo(
    () => (total > 0 ? ((primaryCount / total) * 100 || 0) : 0),
    [primaryCount, total],
  );
  const secondaryPercentage = useMemo(
    () => (total > 0 ? ((secondaryCount / total) * 100) || 0 : 0),
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
        <Tooltip label={tooltips.primary} position="top" withArrow disabled={!tooltips.primary}>
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
        </Tooltip>
        <Tooltip label={tooltips.secondary} position="top" withArrow disabled={!tooltips.secondary}>
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
        </Tooltip>
        <Tooltip label={tooltips.total} position="top" withArrow disabled={!tooltips.total}>
          <Group spacing={4}>
            {renderLegendCircle(totalColor)}
            {!isCompact ? totalText : null}
            <Text size="sm" weight={600}>
              {total}
            </Text>
          </Group>
        </Tooltip>
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
  tooltips: PropTypes.shape({
    primary: PropTypes.string,
    secondary: PropTypes.string,
    total: PropTypes.string,
  }),
};

DoubleSectionProgressBar.defaultProps = {
  primaryColor: '#734AB7',
  secondaryColor: '#AE8EE4',
  totalColor: '#E3DBF1',
  isCompact: true,
  primaryText: '',
  secondaryText: '',
  totalText: '',
  tooltips: {
    primary: '',
    secondary: '',
    total: '',
  },
};

export default DoubleSectionProgressBar;
