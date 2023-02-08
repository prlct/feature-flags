import { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Group, NumberInput, Stack, Switch, TextInput, Tooltip } from '@mantine/core';
import EmailEditor from 'components/emailEditor';
import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';
import { useAmplitude } from 'contexts/amplitude-context';
import { useGrowthFlags } from 'contexts/growth-flags-context';
import { IconInfoCircle } from '@tabler/icons';

const EditEmailModal = ({ context, id, innerProps }) => {
  const { email, sequenceId } = innerProps;
  const [emailName, setEmailName] = useState(email?.name || '');
  const [delayDays, setDelayDays] = useState(email?.delayDays ?? 1);
  const [allowRedirect, setAllowRedirect] = useState(email?.allowRedirect || false);

  const [subject, setSubject] = useState(email?.subject || '');
  const [body, setBody] = useState(email?.body || '');
  const amplitude = useAmplitude();
  const growthflags = useGrowthFlags();
  const isEdit = !!email;

  const {
    mutate: handleEmailUpdate,
    error: updateError,
  } = emailSequencesApi.useEmailUpdate(email?._id);
  const { mutate: handleEmailCreate, error: createError } = emailSequencesApi.useEmailCreate();

  const errors = updateError?.data?.errors || createError?.data?.errors;

  const onSave = () => {
    const data = { ...email, delayDays, name: emailName, subject, body, sequenceId, allowRedirect };
    if (isEdit) {
      handleEmailUpdate(data, {
        onSuccess: () => context.closeModal(id),
      });
    } else {
      handleEmailCreate(data, {
        onSuccess: () => {
          context.closeModal(id);
          amplitude.track('Sequence email created');
          growthflags?.triggerEvent('email-added');
        },
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
      <Group spacing={4} align="center">
        <Switch
          checked={allowRedirect}
          onChange={(e) => setAllowRedirect(e.currentTarget.checked)}
          label="Allow tracking clicks on links in email"
        />
        <Tooltip label="we use URL redirection to track clicks on links in emails">
          <div><IconInfoCircle size={16} /></div>
        </Tooltip>
      </Group>

      <Group position="apart" mt={16}>
        <Button
          variant="subtle"
          color="black"
          onClick={() => context.closeModal(id)}
          sx={{ fontWeight: 600 }}
        >
          Cancel
        </Button>
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
      allowRedirect: PropTypes.bool,
    }),
    sequenceId: PropTypes.string,
  }).isRequired,
};

export default EditEmailModal;
