
const styles = theme => ({
  root: {
    marginTop: theme.spacing(2),
  },
  buttonCell: {
    padding: '0 !important',
    width: 48,
  },
  nameCell: {
    width: '20%',
  },
  descriptionCell: {
    width: '30%',
  },
  valueCell: {
    width: '40%',
  },
  urlHelperWrap: {
    paddingLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginLeft: theme.spacing(),
    },
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noLinkInput: {
    flexGrow: 1,
  },
  addLinkButton: {
    border: 0,
    outline: 0,
    cursor: 'pointer',
    font: 'inherit',
    ...theme.typography.body2,
    fontWeight: 400,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2),
    textDecoration: 'underline',
  },
  withLinkInput: {
    width: `calc(50% - ${theme.spacing(1)}px)`,
  },
});

export default styles;
