import { useContext, useEffect, useState } from 'react';

import { Button, Group, Modal, NumberInput, Stack, TextInput } from '@mantine/core';
import EmailEditor from 'components/emailEditor';

import { EmailSequencesContext } from '../email-sequences-context';

const EditEmailModal = () => {
  const {
    emailModal,
    closeEditEmailModal,
    currentEmail,
    saveCurrentEmail,
  } = useContext(EmailSequencesContext);
  const [emailName, setEmailName] = useState(currentEmail?.name || '');
  const [delay, setDelay] = useState(1);

  useEffect(() => {
    setEmailName(currentEmail?.name);
  }, [currentEmail]);

  const saveEmail = () => {
    currentEmail.name = emailName;
    currentEmail.delay = delay;
    saveCurrentEmail();
    closeEditEmailModal();
  };

  return (
    <Modal opened={emailModal} onClose={closeEditEmailModal} size={800} title="Edit email" padding="xl">
      <Stack>
        <NumberInput value={delay} onChange={setDelay} label="Delay days" />
        <TextInput label="Email name" value={emailName} onChange={(e) => setEmailName(e.target.value)} />
        <EmailEditor />
        <Group position="apart" mt={16}>
          <Button variant="subtle" onClick={closeEditEmailModal}>Cancel</Button>
          <Button color="blue" onClick={saveEmail}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EditEmailModal;
