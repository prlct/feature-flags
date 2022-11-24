import { createStyles } from '@mantine/core';

export const useStyles = createStyles(({ colors }) => ({
  tabPanel: {
    marginBottom: 16,
    width: 'calc(100% - 120px)',
  },
  tabItem: {
    borderRadius: 8,
    height: 42,
    color: '#909090',
    fontWeight: 700,
    fontSize: 16,
    '&[data-active]': {
      backgroundColor: colors.gray[0],
      color: colors.gray[9],
    },
    '&[data-active]:hover': {
      backgroundColor: colors.gray[0],
      color: colors.gray[9],
    },
  },
}));
