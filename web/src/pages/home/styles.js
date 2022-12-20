import { createStyles } from '@mantine/core';

export const useStyles = createStyles(({ colors }) => ({
  headerGroup: {
    width: '100%',
    justifyContent: 'space-between',
    '@media (max-width: 768px)': {
      paddingTop: 16,
      '& h2': {
        fontSize: 18,
      },
      '& button': {
        padding: 8,
        borderRadius: 8,
        width: 156,
        height: 40,
        fontSize: 16,
      },
    },
  },
  search: {
    '& input': {
      border: `1px solid ${colors.gray[2]}`,
      borderRadius: 8,
    },

  },
  itemBlock: {
    padding: 16,
    border: `1px solid ${colors.gray[2]}`,
    borderRadius: 10,
    height: 139,
  },
  menuButton: {
    height: 18,
    minHeight: 18,
    '&:disabled': {
      backgroundColor: 'transparent',
      border: 0,
    },
  },
}));
