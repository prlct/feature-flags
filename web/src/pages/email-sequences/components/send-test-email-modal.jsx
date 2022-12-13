import { useState } from 'react';
import PropTypes from 'prop-types';

import { TextInput, Button, Group } from '@mantine/core';

import { useSendTestEmail } from 'resources/email-sequence/email-sequence.api';

const SendTestEmailModal = ({ context, id, innerProps }) => {
  const { email } = innerProps;

  const { mutate: sendTestEmail, isLoading, error } = useSendTestEmail(email._id);

  const [targetEmail, setTargetEmail] = useState('');

  const sendHandler = () => {
    sendTestEmail(targetEmail, { onSuccess: () => {
      context.closeModal(id);
    } });
  };

  return (
    <>
      <TextInput
        label="Your email address"
        mt={16}
        value={targetEmail}
        onChange={(e) => setTargetEmail(e.currentTarget.value)}
        error={error?.data?.errors.email}
      />
      <Group position="apart" mt={16}>
        <Button variant="subtle" onClick={() => context.closeModal(id)}>Cancel</Button>
        <Button disabled={isLoading} onClick={sendHandler}>Send</Button>
      </Group>
    </>
  );
};

SendTestEmailModal.propTypes = {
  context: PropTypes.shape({
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    email: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default SendTestEmailModal;
