import { useCallback, useContext, useState } from 'react';
import { Stack, TextInput, Modal, Group, Button } from '@mantine/core';

import queryClient from 'query-client';
import { emailSequenceApi } from 'resources/email-sequence';

import { EmailSequencesContext } from '../email-sequences-context';

const RenameSequenceModal = () => {
  const {
    renameSequenceModal,
    closeRenameSequenceModal,
    currentSequence,
  } = useContext(EmailSequencesContext);
  const [sequenceName, setSequenceName] = useState('');

  const { mutate: rename } = emailSequenceApi.useUpdateSequence();

  const renameSequence = useCallback(() => {
    if (!sequenceName) {
      return;
    }
    rename(
      { _id: currentSequence._id, name: sequenceName },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('sequences');
        },
      },
    );
  }, [currentSequence?._id, rename, sequenceName]);

  return (
    <Modal
      opened={renameSequenceModal}
      onClose={closeRenameSequenceModal}
      title="Rename sequence"
      withCloseButton={false}
      centered
    >
      <Stack>
        <TextInput label="Name" placeholder="Name" value={sequenceName} onChange={(e) => setSequenceName(e.currentTarget.value)} />
        <Group position="apart">
          <Button variant="subtle" onClick={closeRenameSequenceModal}>
            Cancel
          </Button>
          <Button onClick={renameSequence}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default RenameSequenceModal;
