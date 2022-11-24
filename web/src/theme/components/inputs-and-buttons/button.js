export const Button = ({
  colors,
}, { variant, color }) => {
  const receiveButtonBackgroundColor = (buttonVariant, buttonFilledColor) => {
    if (buttonVariant === 'light') {
      return 'rgba(115, 74, 183, 0.1)';
    }

    if (buttonVariant === 'subtle') {
      return 'transparent';
    }

    return buttonFilledColor;
  };

  const receiveButtonColor = (buttonVariant, buttonFilledColor) => {
    if (buttonVariant === 'light') {
      return colors.primary[4];
    }

    return buttonFilledColor;
  };

  return ({
    root: {
      boxSizing: 'border-box',
      borderRadius: 12,
      fontWeight: variant === 'light' ? 600 : 500,
      cursor: 'pointer',
      outline: 'none',
      height: variant === 'light' ? 44 : 40,
      padding: '0 24px',
      backgroundColor: color === colors.gray[0] ? colors.gray[0]
        : receiveButtonBackgroundColor(variant, colors.primary[4]),
      color: receiveButtonColor(variant, color),
      border: 'none',

      '&[data-disabled]': {
        backgroundColor: variant === 'subtle' ? 'transparent' : colors.gray[1],
        color: colors.gray[3],
      },
      '&[data-loading]': {
        '& svg': {
          stroke: colors.primary[4],
          strokeLinecap: 'round',
          '& circle': {
            stroke: colors.primary[4],
            strokeOpacity: 1,
          },
        },
      },
    },
    loading: {
      textIndent: '-9999px',
    },
    leftIcon: {
      marginRight: 8,
    },
  });
};
