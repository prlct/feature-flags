import { createStyles } from '@mantine/core';

export const useStyles = createStyles(({ colors }) => ({
  headerGroup: {
    width: '100%',
    '@media (max-width: 768px)': {
      paddingTop: 16,
      '& h2': {
        fontSize: 18,
      },
    },
  },
  search: {
    width: 568,
    '& input': {
      border: `1px solid ${colors.gray[2]}`,
      borderRadius: 8,
      '@media (max-width: 768px)': {
        width: '100%',
      },
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
    '& thead tr th:nth-child(4)': {
      width: '30%',
    },
  },
  multiSelect: {
    padding: 0,
  },
  tableTitle: {
    width: 120,
    fontSize: 14,
    fontWeight: 400,
    color: colors.gray[4],
    justifyContent: 'flex-start',
  },
  menuItem: {
    height: 18,
    minHeight: 18,
  },
}));
