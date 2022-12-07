export const getInputStyles = ({
  colors,
  other: {
    transition: { speed, easing },
  },
}) => ({
  input: {
    minHeight: 40,
    borderRadius: 6,
    fontSize: 14,
    lineHeight: '17px',
    color: colors.gray[9],
    caretColor: colors.primary[4],
    '&::placeholder': {
      color: colors.gray[4],
    },

    '&:hover:not(:disabled):not(:focus):not(:focus-within)': {
      borderColor: colors.primary[5],
    },

    '&:focus, &:focus-within': {
      borderColor: colors.primary[4],

      '& + div[class*="Select-rightSection"] svg': {
        transform: 'rotate(180deg)',
      },
    },

    '&:disabled': {
      backgroundColor: colors.gray[0],
    },
  },

  rightSection: {
    '& svg': {
      transition: `transform ${speed.fast} ${easing.easeInOut}`,
    },
  },

  invalid: {
    '&, &:focus, &:focus-within, &:hover': {
      color: colors.gray[9],
      borderColor: colors.red[5],
    },

    '&::placeholder': {
      color: colors.gray[4],
    },
  },
});
