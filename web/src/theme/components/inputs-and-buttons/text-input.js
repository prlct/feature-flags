import { getInputStyles } from 'theme/helpers';

export const TextInput = (theme, { variant }) => ({
  ...getInputStyles(theme),
  border: variant === 'unstyled' ? 'none' : `1px solid ${theme.colors.gray[2]}`,
});
