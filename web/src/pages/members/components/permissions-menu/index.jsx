import { Checkbox } from '@mantine/core';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@mantine/hooks';

import { useStyles } from './styles';

const PermissionsMenu = ({ permissions, onPermissionChanged, disabled }) => {
  const { classes } = useStyles();
  const matches = useMediaQuery('(max-width: 768px)');

  const size = matches ? 'xs' : 'sm';
  const orientation = matches ? 'vertical' : 'horizontal';
  const spacing = matches ? 0 : undefined;

  return (
    <Checkbox.Group
      value={permissions}
      onChange={onPermissionChanged}
      offset={0}
      size="xs"
      orientation={orientation}
      spacing={spacing}
    >
      <Checkbox
        value="manageSenderEmails"
        label="Emails"
        disabled={disabled}
        size={size}
        classNames={{
          labelWrapper: classes.labelWrapper,
          label: classes.label,
          input: classes.input,
        }}
      />
      <Checkbox
        value="manageMembers"
        label="Members"
        disabled={disabled}
        size={size}
        classNames={{
          labelWrapper: classes.labelWrapper,
          label: classes.label,
          input: classes.input,
        }}
      />
      <Checkbox
        value="managePayments"
        label="Payments"
        disabled={disabled}
        size={size}
        classNames={{
          labelWrapper: classes.labelWrapper,
          label: classes.label,
          input: classes.input,
        }}
      />
    </Checkbox.Group>
  );
};

PermissionsMenu.propTypes = {
  disabled: PropTypes.bool.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPermissionChanged: PropTypes.func.isRequired,
};

export default PermissionsMenu;
