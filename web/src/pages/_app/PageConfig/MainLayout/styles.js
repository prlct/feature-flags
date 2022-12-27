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
    marginTop: 25,
    marginLeft: 31,
    '@media (max-width: 768px)': {
      flexWrap: 'nowrap',
      '& svg': {
        height: 24,
        maxWidth: 140,
      },
    },
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
    '@media (max-width: 768px)': {
      fontSize: 16,
    },
  },
  activeLabel: {
    fontWeight: 700,
    color: colors.gray[9],
  },
  pipelineActiveTab: {
    backgroundColor: colors.gray[0],
  },
  container: {
    padding: 24,
    '@media (max-width: 768px)': {
      padding: '0 20px',
      borderTop: `1px solid ${colors.gray[2]}`,
    },
  },
  logout: {
    margin: 16,
    paddingTop: 8,
    height: 40,
    width: 'calc(100% - 16px)',
    position: 'relative',
    borderTop: `1px solid ${colors.gray[2]}`,
    '&:hover': {
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
  },
}));
