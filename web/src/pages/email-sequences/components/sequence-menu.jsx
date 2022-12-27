import PropTypes from 'prop-types';

import { LoadingOverlay, Menu, UnstyledButton } from '@mantine/core';
import { IconDots, IconEdit, IconPlayerPlay, IconPlayerStop, IconPlus, IconTrash } from '@tabler/icons';
import { openContextModal } from '@mantine/modals';
import { useMediaQuery } from '@mantine/hooks';
import { useRemoveSequence, useToggleSequenceEnabled } from 'resources/email-sequence/email-sequence.api';

const ICON_SIZE = 16;

const SequenceMenu = ({ sequence }) => {
  const isEdit = !!sequence?.name;

  const addOrEditIcon = isEdit ? <IconEdit size={ICON_SIZE} /> : <IconPlus size={ICON_SIZE} />;
  const addOrEditText = isEdit ? 'Edit' : 'Add';
  const startOrStopText = sequence?.enabled ? 'Stop' : 'Start';
  const startStopIcon = sequence?.enabled
    ? <IconPlayerStop size={ICON_SIZE} />
    : <IconPlayerPlay size={ICON_SIZE} />;

  const { mutate: removeSequenceHandler, isLoading } = useRemoveSequence();
  const {
    mutate: toggleSequenceEnabled,
    isLoading: toggleSequenceLoading,
  } = useToggleSequenceEnabled();

  const matches = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <LoadingOverlay visible={isLoading || toggleSequenceLoading} />
      <Menu
        position={matches ? 'bottom-end' : 'bottom'}
        transition="pop"
        withinPortal
        disabled={!isEdit}
        width={matches && 190}
        sx={{ '& .mantine-Menu-item': { padding: matches && '14px 13px' } }}
      >
        <Menu.Target>
          <UnstyledButton p={0} variant="subtle"><IconDots color="gray" /></UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={!matches && addOrEditIcon}
            onClick={() => openContextModal({
              modal: 'addUsers',
              size: 464,
              fullScreen: matches,
              innerProps: { sequence },
              title: 'Add subscribers to pipeline',
              styles: { title: { fontSize: 20, fontWeight: 600 } },
            })}
          >
            Add subscribers
          </Menu.Item>
          <Menu.Item
            icon={!matches && addOrEditIcon}
            onClick={() => openContextModal({
              modal: 'triggerSelection',
              size: 696,
              fullScreen: matches,
              innerProps: { sequence },
              title: 'Trigger',
              styles: { title: { fontSize: 20, fontWeight: 600 } },
            })}
          >
            {`${addOrEditText} trigger`}
          </Menu.Item>
          <Menu.Item
            icon={!matches && addOrEditIcon}
            onClick={() => openContextModal({ modal: 'renameSequence', innerProps: { _id: sequence?._id, name: sequence?.name } })}
          >
            Rename
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            icon={!matches && startStopIcon}
            onClick={() => toggleSequenceEnabled(sequence?._id)}
          >
            {`${startOrStopText} sequence`}
          </Menu.Item>

          {sequence?._id && (
          <Menu.Item
            icon={!matches && <IconTrash size={16} color="red" />}
            onClick={() => removeSequenceHandler(sequence?._id)}
            sx={{ color: 'red' }}
          >
            Delete sequence
          </Menu.Item>
          )}

          <Menu.Divider />
        </Menu.Dropdown>
      </Menu>
    </>
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
