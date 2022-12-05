import { useContext } from 'react';
import { Modal, TextInput, Button, Group } from '@mantine/core';

const SendTestEmailModal = () => {


  return (
    <Modal
      title="Send test email"
      withCloseButton={false}
      centered
    >
      <TextInput label="Your email address" mt={16} />
      <Group position="apart" mt={16}>
        <Button variant="subtle">Cancel</Button>
        <Button color="green">Send</Button>
      </Group>
    </Modal>
  );
};

export default SendTestEmailModal;
