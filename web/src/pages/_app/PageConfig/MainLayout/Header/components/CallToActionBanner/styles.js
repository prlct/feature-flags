import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  container: {
    flexWrap: 'nowrap',
    '@media (max-width: 768px)': {
      flexWrap: 'wrap',
    },
  },
  alert: {
    paddingRight: 35,
  },
}));
