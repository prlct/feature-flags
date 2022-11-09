import PropTypes from 'prop-types';

import { Menu, UnstyledButton } from '@mantine/core';
import { IconDots, IconEdit, IconPlayerPlay, IconPlayerStop, IconPlus, IconSend, IconTrash } from '@tabler/icons';
import { useContext } from 'react';

import { EmailSequencesContext } from '../email-sequences-context';

const ICON_SIZE = 16;

const SequenceMenu = ({ sequence }) => {
  const { dispatch } = useContext(EmailSequencesContext);
  const isEdit = !!sequence?.name;

  const addOrEditIcon = isEdit ? <IconEdit size={ICON_SIZE} /> : <IconPlus size={ICON_SIZE} />;
  const addOrEditText = isEdit ? 'Edit' : 'Add';
  const startOrStopText = sequence?.enabled ? 'Stop' : 'Start';
  const startStopIcon = sequence?.enabled
    ? <IconPlayerStop size={ICON_SIZE} />
    : <IconPlayerPlay size={ICON_SIZE} />;

  const addTriggerHandler = () => {
    dispatch({ type: 'open-modal', name: 'triggerSelection' });
    dispatch({ type: 'set-current-sequence', sequence });
  };

  const sendTestEmailHandler = () => {
    dispatch({ type: 'open-modal', name: 'testEmail' });
    dispatch({ type: 'set-current-sequence', sequence });
  };

  return (
    <Menu position="bottom" transition="pop" withinPortal disabled={!isEdit}>
      <Menu.Target>
        <UnstyledButton p={0} variant="subtle"><IconDots /></UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={addOrEditIcon}>
          {`${addOrEditText} audience`}
        </Menu.Item>
        <Menu.Item icon={addOrEditIcon} onClick={addTriggerHandler}>
          {`${addOrEditText} trigger`}
        </Menu.Item>
        <Menu.Item icon={addOrEditIcon}>
          {`${addOrEditText} email`}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item icon={startStopIcon}>{`${startOrStopText} sequence`}</Menu.Item>
        <Menu.Item icon={<IconTrash size={16} color="red" />}>Delete sequence</Menu.Item>
        <Menu.Divider />
        <Menu.Item
          icon={<IconSend size={16} />}
          onClick={sendTestEmailHandler}
        >
          Send a test sequence
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

SequenceMenu.propTypes = {
  sequence: PropTypes.shape({
    name: PropTypes.string,
    enabled: PropTypes.bool,
  }),
};

SequenceMenu.defaultProps = {
  sequence: null,
};

export default SequenceMenu;
