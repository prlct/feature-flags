import { createStyles } from '@mantine/core';

export const useStyles = createStyles(({ colors }) => ({
  tabItem: {
    height: 40,
    width: '100%',
    position: 'relative',
  },
  logoGroup: {
    width: 255,
    marginBottom: 45,
    marginTop: 29,
    marginLeft: 31,
  },
  activeTab: {
    backgroundColor: colors.gray[0],
    height: 56,
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      height: 56,
      width: 2,
      backgroundColor: colors.gray[9],
    },
  },
  tabIcon: {
    color: colors.gray[4],
  },
  activeIcon: {
    color: colors.gray[9],
  },
  label: {
    color: colors.gray[4],
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '24px',
  },
  activeLabel: {
    fontWeight: 700,
    color: colors.gray[9],
  },
}));
