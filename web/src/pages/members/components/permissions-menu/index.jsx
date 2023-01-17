import { Checkbox } from '@mantine/core';
import PropTypes from 'prop-types';

import { useStyles } from './styles';

const PermissionsMenu = ({ permissions, onPermissionChanged, disabled }) => {
  const { classes } = useStyles();
  return (
    <Checkbox.Group
      value={permissions}
      onChange={onPermissionChanged}
    >
      <Checkbox
        value="manageSenderEmails"
        label="Emails"
        disabled={disabled}
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
