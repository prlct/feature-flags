import { createStyles } from '@mantine/core';

export const useStyles = createStyles({
  googleButton: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    paddingLeft: '0',
    paddingRight: '8px',
    border: 'thin solid #888',
    borderRadius: '6px',
    gap: '24px',
    height: '40px',
  },
  githubButton: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    paddingLeft: '8px',
    paddingRight: '8px',
    border: 'thin solid #888',
    borderRadius: '6px',
    gap: '37px',
    height: '40px',
  },
});
