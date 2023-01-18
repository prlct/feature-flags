import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  card: {
    flex: '1 1',
    borderColor: theme.colors.gray[3],
    borderRadius: 10,
  },
  active: {
    border: 'none',
    background: 'rgba(115, 74, 183, 0.05)',
  },
  icon: {
    color: theme.colors.gray[6],
    '@media (max-width: 768px)': {
      strokeWidth: 4,
    },
  },
  activeText: {
    height: '42px',
    fontWeight: 500,
    color: theme.colors.green[9],
  },
  activeIcon: {
    marginRight: '4px',
    padding: '2px',
    backgroundColor: theme.colors.green[9],
    borderRadius: '50%',
    color: theme.white,
  },
  badge: {
    padding: '0 8px',
    borderRadius: 8,
    '@media (max-width: 768px)': {
      height: 24,
      fontSize: 10,
    },
  },
}));
