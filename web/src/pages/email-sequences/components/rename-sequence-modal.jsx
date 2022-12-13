import { useState } from 'react';
import PropTypes from 'prop-types';

import { Stack, TextInput, Group, Button } from '@mantine/core';
import * as emailSequenceApi from 'resources/email-sequence/email-sequence.api';

const RenameSequenceModal = ({ context, id, innerProps }) => {
  const [sequenceName, setSequenceName] = useState(innerProps.name || '');

  const { mutate: rename } = emailSequenceApi.useUpdateSequence();

  const renameSequence = () => {
    rename({ _id: innerProps._id, name: sequenceName });
    context.closeModal(id);
  };

  return (
    <Stack>
      <TextInput label="Name" placeholder="Name" value={sequenceName} onChange={(e) => setSequenceName(e.currentTarget.value)} />
      <Group position="apart">
        <Button variant="subtle" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button onClick={renameSequence}>
          Save
        </Button>
      </Group>
    </Stack>
  );
};

RenameSequenceModal.propTypes = {
  context: PropTypes.shape({
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default RenameSequenceModal;
