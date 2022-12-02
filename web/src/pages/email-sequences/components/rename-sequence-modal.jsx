import { useCallback, useContext, useState } from 'react';
import { Stack, TextInput, Modal, Group, Button } from '@mantine/core';

import queryClient from 'query-client';
import { emailSequenceApi } from 'resources/email-sequence';

import { EmailSequencesContext } from '../email-sequences-context';

const RenameSequenceModal = () => {
  const {
    renameSequenceModal,
    closeRenameSequenceModal,
  } = useContext(EmailSequencesContext);
  const currentSequence = queryClient.getQueryData('currentSequence');
  const currentPipeline = queryClient.getQueryData('currentPipeline');

  const [sequenceName, setSequenceName] = useState(currentSequence?.name || '');

  const { mutate: renameSequence } = emailSequenceApi.useUpdateSequence();
  const { mutate: createSequence } = emailSequenceApi.useAddSequence();

  const onRenameSequenceSave = useCallback(() => {
    if (!sequenceName) {
      return;
    }
    if (!currentSequence?._id) {
      createSequence(
        {
          pipelineId: currentPipeline._id,
          name: sequenceName,
        },
        {
          onSettled: () => {
            closeRenameSequenceModal();
          },
        },
      );
      return;
    }
    renameSequence(
      { _id: currentSequence._id, name: sequenceName },
      {
        onSettled: () => {
          closeRenameSequenceModal();
        },
      },
    );
  }, [closeRenameSequenceModal, createSequence, currentPipeline?._id, currentSequence?._id,
    renameSequence, sequenceName]);

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
          <Button onClick={onRenameSequenceSave}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default RenameSequenceModal;
