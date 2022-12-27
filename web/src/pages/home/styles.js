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
  table: {
    borderRadius: 8,
    '& thead tr th': {
      color: colors.gray[4],
      fontWeight: 400,
      padding: '8px 24px',
      lineHeight: '24px',
    },
  },
  addButton: {
    padding: '8px 24px',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    width: 205,
    textAlign: 'center',
    '@media (max-width: 768px)': {
      padding: '8px 12px',
      fontSize: 15,
      width: 156,
    },
  },
}));
