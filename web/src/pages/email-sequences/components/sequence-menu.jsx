import PropTypes from 'prop-types';

import { Menu, UnstyledButton } from '@mantine/core';
import { IconDots, IconEdit, IconPlayerPlay, IconPlayerStop, IconPlus, IconSend, IconTrash } from '@tabler/icons';
import { openContextModal } from '@mantine/modals';

const ICON_SIZE = 16;

const SequenceMenu = ({ sequence }) => {
  const isEdit = !!sequence?.name;

  const addOrEditIcon = isEdit ? <IconEdit size={ICON_SIZE} /> : <IconPlus size={ICON_SIZE} />;
  const addOrEditText = isEdit ? 'Edit' : 'Add';
  const startOrStopText = sequence?.enabled ? 'Stop' : 'Start';
  const startStopIcon = sequence?.enabled
    ? <IconPlayerStop size={ICON_SIZE} />
    : <IconPlayerPlay size={ICON_SIZE} />;

  return (
    <Menu position="bottom" transition="pop" withinPortal disabled={!isEdit}>
      <Menu.Target>
        <UnstyledButton p={0} variant="subtle"><IconDots color="gray" /></UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={addOrEditIcon}>
          Add users
        </Menu.Item>
        <Menu.Item
          icon={addOrEditIcon}
          onClick={() => openContextModal({ modal: 'triggerSelection', innerProps: { sequence } })}
        >
          {`${addOrEditText} trigger`}
        </Menu.Item>
        <Menu.Item icon={addOrEditIcon} onClick={() => openContextModal({ modal: 'renameSequence', innerProps: { _id: sequence?._id, name: sequence?.name } })}>
          Rename
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item icon={startStopIcon}>{`${startOrStopText} sequence`}</Menu.Item>
        <Menu.Item icon={<IconTrash size={16} color="red" />}>Delete sequence</Menu.Item>
        <Menu.Divider />
        <Menu.Item
          icon={<IconSend size={16} />}
        >
          Send a test sequence
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

SequenceMenu.propTypes = {
  sequence: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    enabled: PropTypes.bool,
  }),
};

SequenceMenu.defaultProps = {
  sequence: null,
};

export default SequenceMenu;
