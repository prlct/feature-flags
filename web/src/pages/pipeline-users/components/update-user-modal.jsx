import { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Group, MultiSelect, Stack, TextInput } from '@mantine/core';
import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';

const UpdateUserModal = ({ context, id, innerProps }) => {
  const { user, pipelines } = innerProps;

  const [email, setEmailName] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [pipelineList, setPipelineList] = useState(user.pipelines || []);

  const {
    mutate: handleUserUpdate,
    error: updateError,
  } = emailSequencesApi.useUpdateUser(user?._id);

  const errors = updateError?.data?.errors;

  const onSave = () => {
    const data = { email, firstName, lastName, pipelines: pipelineList };
    handleUserUpdate(data, {
      onSuccess: () => context.closeModal(id),
    });
  };

  const getPipelinesList = (pipelines) => pipelines
    .map((pipeline) => ({ value: pipeline._id, label: pipeline.name }));

  const handlePipelinesList = (selectedPipelines) => {
    const pipelinesList = pipelines.filter((pipeline) => selectedPipelines.includes(pipeline._id));
    setPipelineList(pipelinesList.map((pipeline) => ({ _id: pipeline._id, name: pipeline.name })));
  };

  return (
    <Stack>
      <TextInput
        label="Email name"
        value={email}
        onChange={(e) => setEmailName(e.target.value)}
        error={errors?.name}
      />
      <TextInput
        label="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextInput
        label="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <MultiSelect
        label="Pipelines"
        data={getPipelinesList(pipelines)}
        defaultValue={[]}
        clearButtonLabel="Clear selection"
        value={pipelineList.map(p => p._id)}
        onChange={(value) => handlePipelinesList(value)}
        size="sm"
        styles={{
          defaultValue: { paddingLeft: 0 },
        }}
      />
      <Group position="apart" mt={16}>
        <Button variant="subtle" onClick={() => context.closeModal(id)}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
      </Group>
    </Stack>
  );
};

UpdateUserModal.propTypes = {
  context: PropTypes.shape({
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string,
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      pipeline: PropTypes.shape({
        _id: PropTypes.string,
      }),
      pipelines: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
      })),
    }),
    pipelines: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    })),
  }).isRequired,
};

export default UpdateUserModal;
