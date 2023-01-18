import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme, matches) => ({
  planDescription: {
    letterSpacing: '0.01em',
    color: theme.colors.gray[4],
    fontWeight: 400,
    '& b': {
      textTransform: 'capitalize',
    },
    fontSize: matches && 14,
  },
  limitBox: {
    padding: 20,
    width: matches ? '100%' : 'calc(50% - 10px)',
    border: `1px solid ${theme.colors.gray[2]}`,
    borderRadius: 15,
  },
  limitBoxTitle: {
    letterSpacing: '0.01em',
    color: theme.colors.gray[4],
    fontWeight: 400,
    lineHeight: '24px',
  },
  progressValue: {
    color: theme.colors.gray[4],
    fontWeight: 400,
  },
  progressBar: {
    root: {
      backgroundColor: theme.colors.primary[4],
    },
  },
}));
