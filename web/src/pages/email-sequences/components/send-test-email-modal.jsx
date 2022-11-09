import { useContext } from 'react';
import { Modal, TextInput, Button, Group } from '@mantine/core';

import { EmailSequencesContext } from '../email-sequences-context';

const SendTestEmailModal = () => {
  const { context, dispatch } = useContext(EmailSequencesContext);

  const onClose = () => dispatch({ name: 'testEmail', type: 'close-modal' });

  return (
    <Modal
      opened={context.testEmail}
      onClose={onClose}
      title="Send test email"
      withCloseButton={false}
      centered
    >
      <TextInput label="Your email address" mt={16} />
      <Group position="apart" mt={16}>
        <Button variant="subtle" onClick={onClose}>Cancel</Button>
        <Button color="green">Send</Button>
      </Group>
    </Modal>
  );
};

export default SendTestEmailModal;
