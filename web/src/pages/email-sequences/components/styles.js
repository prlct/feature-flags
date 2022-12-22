import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  pipeline: {
    backgroundColor: theme.colors.gray[1],
    padding: 32,
    width: 368,
    borderRadius: 12,
    border: `1px solid ${theme.colors.gray[2]}`,
    '@media (max-width: 768px)': {
      width: 280,
      padding: 16,
      fontSize: 16,
    },
  },
  pipelineDisabled: {
    backgroundColor: theme.colors.gray[3],
  },
  addButton: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    width: '100%',
    textAlign: 'center',
  },
}));
