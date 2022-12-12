import PropTypes from 'prop-types';

import { Menu, UnstyledButton } from '@mantine/core';
import { IconDots, IconEdit, IconPlayerPlay, IconPlayerStop, IconPlus, IconTrash } from '@tabler/icons';
import { openContextModal } from '@mantine/modals';
import { useRemoveSequence } from 'resources/email-sequence/email-sequence.api';

const ICON_SIZE = 16;

const SequenceMenu = ({ sequence }) => {
  const isEdit = !!sequence?.name;

  const addOrEditIcon = isEdit ? <IconEdit size={ICON_SIZE} /> : <IconPlus size={ICON_SIZE} />;
  const addOrEditText = isEdit ? 'Edit' : 'Add';
  const startOrStopText = sequence?.enabled ? 'Stop' : 'Start';
  const startStopIcon = sequence?.enabled
    ? <IconPlayerStop size={ICON_SIZE} />
    : <IconPlayerPlay size={ICON_SIZE} />;

  const removeSequenceHandler = useRemoveSequence().mutate;

  return (
    <Menu position="bottom" transition="pop" withinPortal disabled={!isEdit}>
      <Menu.Target>
        <UnstyledButton p={0} variant="subtle"><IconDots color="gray" /></UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={addOrEditIcon} onClick={() => openContextModal({ modal: 'addUsers', innerProps: { sequence } })}>
          Add users
        </Menu.Item>
        <Menu.Item
          icon={addOrEditIcon}
          onClick={() => openContextModal({ modal: 'triggerSelection', size: 600, innerProps: { sequence } })}
        >
          {`${addOrEditText} trigger`}
        </Menu.Item>
        <Menu.Item icon={addOrEditIcon} onClick={() => openContextModal({ modal: 'renameSequence', innerProps: { _id: sequence?._id, name: sequence?.name } })}>
          Rename
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item icon={startStopIcon}>{`${startOrStopText} sequence`}</Menu.Item>

        {sequence?._id && (
        <Menu.Item
          icon={<IconTrash size={16} color="red" />}
          onClick={() => removeSequenceHandler(sequence?._id)}
        >
          Delete sequence
        </Menu.Item>
        )}

        <Menu.Divider />
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
