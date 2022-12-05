import { useState } from 'react';

import { Button, Group, Modal, NumberInput, Stack, TextInput } from '@mantine/core';
import EmailEditor from 'components/emailEditor';

const EditEmailModal = () => {

  const [emailName, setEmailName] = useState('');
  const [delay, setDelay] = useState(1);

  return (
    <Modal size={800} title="Edit email" padding="xl">
      <Stack>
        <NumberInput value={delay} onChange={setDelay} label="Delay days" />
        <TextInput label="Email name" value={emailName} onChange={(e) => setEmailName(e.target.value)} />
        <EmailEditor />
        <Group position="apart" mt={16}>
          <Button variant="subtle">Cancel</Button>
          <Button color="blue">Save</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EditEmailModal;
