import { createStyles } from '@mantine/core';

export const useStyles = createStyles(({ colors }) => ({
  pipeline: {
    backgroundColor: colors.gray[1],
    padding: 32,
    width: 368,
    borderRadius: 12,
    border: `1px solid ${colors.gray[2]}`,
  },
  addButton: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    width: '100%',
    textAlign: 'center',
  },
}));
