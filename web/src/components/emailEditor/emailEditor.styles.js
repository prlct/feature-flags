import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  root: {
    minWidth: 700,
    position: 'relative',
    margin: 16,
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
  },
  quillWrap: {
    marginTop: 8,
    marginLeft: -15,
    width: 'calc(100% + 30px)',
    height: 300,
    minHeight: 300,
    overflow: 'auto',
  },
}));
