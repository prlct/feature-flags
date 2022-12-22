import { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import EmailEditor from 'components/emailEditor';
import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';

const EditEmailModal = ({ context, id, innerProps }) => {
  const { email, sequenceId } = innerProps;
  const [emailName, setEmailName] = useState(email?.name || '');
  const [delayDays, setDelayDays] = useState(email?.delayDays ?? 1);

  const [subject, setSubject] = useState(email?.subject || '');
  const [body, setBody] = useState(email?.body || '');

  const isEdit = !!email;

  const {
    mutate: handleEmailUpdate,
    error: updateError,
  } = emailSequencesApi.useEmailUpdate(email?._id);
  const { mutate: handleEmailCreate, error: createError } = emailSequencesApi.useEmailCreate();

  const errors = updateError?.data?.errors || createError?.data?.errors;

  const onSave = () => {
    const data = { ...email, delayDays, name: emailName, subject, body, sequenceId };
    if (isEdit) {
      handleEmailUpdate(data, {
        onSuccess: () => context.closeModal(id),
      });
    } else {
      handleEmailCreate(data, {
        onSuccess: () => context.closeModal(id),
      });
    }
  };

  return (
    <Stack>
      <NumberInput
        value={delayDays}
        onChange={setDelayDays}
        label="Delay days"
        min={0}
        error={errors?.delayDays}
      />
      <TextInput
        label="Email name"
        value={emailName}
        onChange={(e) => setEmailName(e.target.value)}
        error={errors?.name}
      />
      <EmailEditor
        subject={subject}
        body={body}
        setBody={setBody}
        setSubject={setSubject}
        errors={errors}
      />
      <Group position="apart" mt={16}>
        <Button variant="subtle" onClick={() => context.closeModal(id)}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
      </Group>
    </Stack>
  );
};

EditEmailModal.propTypes = {
  context: PropTypes.shape({
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    email: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      delayDays: PropTypes.number,
      body: PropTypes.string,
      subject: PropTypes.string,
    }),
    sequenceId: PropTypes.string,
  }).isRequired,
};

export default EditEmailModal;
