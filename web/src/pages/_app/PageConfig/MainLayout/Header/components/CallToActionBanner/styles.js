import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  container: {
    position: 'sticky',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '64px',
    padding: '0 32px',
    background: `linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), ${theme.colors.blue[6]}`,
    zIndex: 100,
  },
  icon: {
    color: theme.colors.orange[6],
  },
}));
