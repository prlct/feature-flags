import { createStyles } from '@mantine/core';

export const useStyles = createStyles(({ colors }) => ({
  menuItem: {
    height: 18,
    minHeight: 18,
  },
  table: {
    borderRadius: 8,
    '& thead tr th': {
      color: colors.gray[4],
      fontWeight: 400,
    },
  },
}));
