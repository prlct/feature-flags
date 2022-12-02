import { useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Menu, Text, Title, UnstyledButton } from '@mantine/core';
import { IconDots, IconEdit, IconPlayerPlay, IconPlayerStop, IconPlus, IconSend, IconTrash } from '@tabler/icons';

import queryClient from 'query-client';
import { useModals } from '@mantine/modals';
import { EmailSequencesContext } from '../email-sequences-context';
import { emailSequenceApi } from '../../../resources/email-sequence';

const ICON_SIZE = 16;

const SequenceMenu = ({ sequence }) => {
  const {
    openTriggerModal,
    openSendTestEmailModal,
    openAddUsersModal,
    openRenameSequenceModal,
  } = useContext(EmailSequencesContext);

  const modals = useModals();
  const isEdit = !!sequence?.name;

  const { mutate: removeSequence } = emailSequenceApi.useRemoveSequence();

  const addOrEditIcon = isEdit ? <IconEdit size={ICON_SIZE} /> : <IconPlus size={ICON_SIZE} />;
  const addOrEditText = isEdit ? 'Edit' : 'Add';
  const startOrStopText = sequence?.enabled ? 'Stop' : 'Start';
  const startStopIcon = sequence?.enabled
    ? <IconPlayerStop size={ICON_SIZE} />
    : <IconPlayerPlay size={ICON_SIZE} />;

  const addTriggerHandler = () => {
    openTriggerModal(sequence);
  };

  const addUsersHandler = () => {
    openAddUsersModal();
  };

  const renameSequenceHandler = () => {
    openRenameSequenceModal();
  };

  const handleRemoveSequence = useMemo(() => () => {
    const currentSequence = queryClient.getQueryData(['currentSequence']);
    modals.openConfirmModal({
      title: (<Title order={3}>{`Delete sequence ${currentSequence.name}`}</Title>),
      centered: true,
      children: (
        <Text>
          {`Delete pipeline ${currentSequence.name}?`}
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'subtle' },
      cancelProps: { variant: 'subtle' },
      onConfirm: () => {
        removeSequence(currentSequence._id);
      },
    });
  }, [modals, removeSequence]);

  const addCurrentSequence = useCallback(() => {
    queryClient.setQueryData(['currentSequence'], sequence);
  }, [sequence]);

  return (
    <Menu position="bottom" transition="pop" withinPortal disabled={!isEdit}>
      <Menu.Target>
        <UnstyledButton p={0} variant="subtle"><IconDots color="gray" onClick={addCurrentSequence} /></UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={addOrEditIcon} onClick={renameSequenceHandler}>
          Rename
        </Menu.Item>
        <Menu.Item icon={addOrEditIcon} onClick={addUsersHandler}>
          Add users
        </Menu.Item>
        <Menu.Item icon={addOrEditIcon} onClick={addTriggerHandler}>
          {`${addOrEditText} trigger`}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item icon={startStopIcon}>{`${startOrStopText} sequence`}</Menu.Item>
        <Menu.Item icon={<IconTrash size={16} color="red" />} onClick={handleRemoveSequence}>Delete sequence</Menu.Item>
        <Menu.Divider />
        <Menu.Item
          icon={<IconSend size={16} />}
          onClick={openSendTestEmailModal}
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
