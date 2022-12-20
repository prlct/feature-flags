import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  main: {
    minHeight: '72px',
    backgroundColor: theme.white,
    display: 'flex',
    alignItems: 'center',
    flex: '0 1 auto',
    borderBottom: 'transparent',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      height: 1,
      width: 'calc(100% - 255px)',
      backgroundColor: 'rgba(9, 30, 66, 0.02)',
    },
  },
  logoGroup: {
    width: 255,
  },
  menu: {
    '@media (max-width: 768px)': {
      marginTop: 13,
    },
  },
}));
