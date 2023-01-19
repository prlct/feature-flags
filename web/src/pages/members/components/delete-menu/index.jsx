import { Menu, ActionIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons';
import CardSettingsButton from 'pages/email-sequences/components/card-settings-button';
import PropTypes from 'prop-types';

import { useStyles } from '../../styles';

const MemberMenu = (props) => {
  const { onDelete, loading } = props;

  const { classes } = useStyles();
  const matches = useMediaQuery('(max-width: 768px)');

  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <ActionIcon
          loading={loading}
          title="Settings"
          variant="transparent"
          className={classes.menuButton}
        >
          <CardSettingsButton />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown sx={{ width: '192px !important', height: 60 }}>
        <Menu.Item
          icon={!matches && <IconTrash size={14} />}
          color="red"
          onClick={onDelete}
          sx={{ padding: '16px 13px' }}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

MemberMenu.propTypes = {
  loading: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
};

MemberMenu.defaultProps = {
  loading: false,
};

export default MemberMenu;
