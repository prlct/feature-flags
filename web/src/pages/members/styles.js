import { createStyles } from '@mantine/core';

export const useStyles = createStyles(({ colors }) => ({
  headerGroup: {
    width: '100%',
    '@media (max-width: 768px)': {
      justifyContent: 'space-between',
      '& button': {
        padding: 8,
        borderRadius: 8,
        width: 65,
        height: 40,
        fontSize: 16,
      },
    },
  },
  search: {
    width: 568,
    '@media (max-width: 768px)': {
      width: 'auto',
      maxWidth: 256,
    },
    '& input': {
      border: `1px solid ${colors.gray[2]}`,
      borderRadius: 8,
    },

  },
  itemBlock: {
    padding: 16,
    border: `1px solid ${colors.gray[2]}`,
    borderRadius: 10,
    minHeight: 85,
    maxHeight: 121,
    '@media (max-width: 768px)': {
      gap: 12,
    },
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
    '& tbody tr td': {
      padding: '34px 24px',
      lineHeight: '17px',
    },
    '& thead tr th:first-child': {
      width: '40%',
    },
  },
  badge: {
    fontSize: 8,
    padding: '0 8px',
    borderRadius: 8,
    '@media (max-width: 768px)': {
      height: 24,
      fontSize: 10,
    },
  },
  addButton: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    width: '100%',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      fontSize: 15,
    },
  },
  menuItem: {
    height: 18,
    minHeight: 18,
  },
}));
