import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  pipeline: {
    backgroundColor: theme.colors.gray[1],
    padding: 32,
    width: 368,
    borderRadius: 12,
    border: `1px solid ${theme.colors.gray[2]}`,
  },
  pipelineDisabled: {
    backgroundColor: '#d5d5d5',
  },
  addButton: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    width: '100%',
    textAlign: 'center',
  },
}));
