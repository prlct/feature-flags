import { useState } from 'react';

import { Button, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import EmailEditor from 'components/emailEditor';
import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';

const EditEmailModal = ({ context, id, innerProps }) => {
  const { email, sequenceId } = innerProps;
  const [emailName, setEmailName] = useState(email?.name || '');
  const [delayDays, setDelayDays] = useState(email?.delayDays || 1);

  const [subject, setSubject] = useState(email?.subject || '');
  const [body, setBody] = useState(email?.body || '');

  const isEdit = !!email;

  const handleEmailUpdate = emailSequencesApi.useEmailUpdate(email?._id).mutate;
  const handleEmailCreate = emailSequencesApi.useEmailCreate().mutate;

  const onSave = () => {
    const data = { ...email, delayDays, name: emailName, subject, body, sequenceId };
    if (isEdit) {
      handleEmailUpdate(data);
    } else {
      handleEmailCreate(data);
    }

    context.closeModal(id);
  };

  return (
    <Stack>
      <NumberInput value={delayDays} onChange={setDelayDays} label="Delay days" min={0} />
      <TextInput label="Email name" value={emailName} onChange={(e) => setEmailName(e.target.value)} />
      <EmailEditor subject={subject} body={body} setBody={setBody} setSubject={setSubject} />
      <Group position="apart" mt={16}>
        <Button variant="subtle" onClick={() => context.closeModal(id)}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
      </Group>
    </Stack>
  );
};

export default EditEmailModal;
