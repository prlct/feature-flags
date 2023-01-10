import PropTypes from 'prop-types';

import { Group, Text, UnstyledButton } from '@mantine/core';
import { ButtonGoogleLight } from 'public/icons';

import { useStyles } from './styles';

const GoogleButton = ({ children, href }) => {
  const { classes } = useStyles();
  return (
    <UnstyledButton
      component="a"
      href={href}
    >
      <Group px="8dp" className={classes.googleButton}>
        <ButtonGoogleLight />
        <Text>
          {children}
        </Text>
      </Group>
    </UnstyledButton>
  );
};

GoogleButton.propTypes = {
  children: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};

export default GoogleButton;
