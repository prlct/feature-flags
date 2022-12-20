import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  root: {
    minWidth: 700,
    position: 'relative',
    margin: 16,
    '@media (max-width: 768px)': {
      margin: 0,
    },
  },
  subject: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: 'solid 0.5px rgba(0, 0, 0, 0.10)',
  },
  subjectInput: {
    color: theme.black,
    marginRight: 8,
  },
  subjectInputWrap: {
    width: '80%',
  },

  separator: {
    borderTop: 'solid 1px grey',
    paddingTop: 16,
    width: '100%',
  },

  toolbar: {
    display: 'flex',

  },
  quillControls: {
    border: '0 !important',
    display: 'inline-flex !important',
    marginLeft: -16,
    '& .ql-editor .button-styles': {
      padding: '10px 24px',
      backgroundColor: theme.colors.primary[4],
      borderRadius: 12,
      border: 'none',
      color: theme.colors.gray[0],
    },
    '@media (max-width: 768px)': {
      flexWrap: 'wrap',
      '& svg': {
        width: 22,
        height: 20,
        padding: '2px 3px',
      },
    },
  },
  quillWrap: {
    marginTop: 8,
    marginLeft: -15,
    width: 'calc(100% + 30px)',
    height: 300,
    minHeight: 300,
    overflow: 'auto',
    '& button': {
      color: 'inherit',
      backgroundColor: 'inherit',
    },
  },
}));
