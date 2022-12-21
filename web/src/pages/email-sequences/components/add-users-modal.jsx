import { useState } from 'react';
import { Stack, TextInput, Text, Group, Button, Accordion, useMantineTheme } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import * as Papa from 'papaparse';

import { useAddUsers, useAddUsersList } from 'resources/email-sequence/email-sequence.api';
import PropTypes from 'prop-types';

const AddUsersModal = ({ context, id, innerProps }) => {
  const { sequence } = innerProps;

  const sequenceId = sequence._id;
  const handleAddUser = useAddUsers(sequenceId).mutate;
  const handleAddUsersList = useAddUsersList(sequenceId).mutate;
  const [email, setEmail] = useState('');
  const [fileCSV, setFileCSV] = useState(null);
  const [emailList, setEmailList] = useState([]);
  const theme = useMantineTheme();

  const addUser = ({ email, sequenceId }) => {
    handleAddUser({ email, sequenceId }, {
      onSuccess: () => {
        context.closeModal(id);
      },
    });
  };

  const addUsersList = ({ emailList, sequenceId }) => {
    handleAddUsersList({ emailList, sequenceId }, {
      onSuccess: () => {
        context.closeModal(id);
      },
    });
  };

  const handleSaveUser = () => {
    if (email) {
      addUser({ email, sequenceId });
    }
    if (emailList.length) {
      addUsersList({ emailList, sequenceId });
    }
  };

  function readFile(uploadFile) {
    setFileCSV(uploadFile);

    const commonConfig = { delimiter: ';' };

    Papa.parse(
      uploadFile,
      {
        ...commonConfig,
        header: true,
        complete: (result) => {
          setEmailList(result.data);
        },
      },
    );
  }

  const rejected = () => {
    showNotification({
      title: 'File was rejected',
      message: 'File was rejected',
      color: 'red',
    });
  };

  return (
    <Stack>
      <Accordion>
        <Accordion.Item value="addUsers">
          <Accordion.Control>Add users</Accordion.Control>
          <Accordion.Panel>
            <TextInput
              label="email"
              placeholder="some@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="addUsersList">
          <Accordion.Control>Import users list</Accordion.Control>
          <Accordion.Panel>
            <Dropzone
              onDrop={(files) => readFile(files[0])}
              onReject={() => rejected()}
              maxFiles={1}
              maxSize={3 * 1024 ** 2}
              accept={['text/csv']}
            >
              {fileCSV ? (
                <Group position="center" spacing="xl" style={{ minHeight: 30, pointerEvents: 'none' }}>
                  <div>
                    <Text size="md" inline>
                      {fileCSV.name}
                    </Text>
                  </div>
                </Group>
              ) : (
                <Group position="center" spacing="xl" style={{ minHeight: 50, pointerEvents: 'none' }}>
                  <Dropzone.Accept>
                    <IconUpload
                      size={50}
                      stroke={1.5}
                      color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      size={50}
                      stroke={1.5}
                      color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={50} stroke={1.5} />
                  </Dropzone.Idle>

                  <div>
                    <Text size="md" inline>
                      Drag or click to select cvs file with email addresses to upload
                    </Text>
                  </div>
                </Group>
              )}

            </Dropzone>
          </Accordion.Panel>
        </Accordion.Item>

      </Accordion>
      <Group position="apart">
        <Button variant="subtle" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button onClick={handleSaveUser}>
          Save
        </Button>
      </Group>
    </Stack>
  );
};

AddUsersModal.propTypes = {
  context: PropTypes.shape({
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    sequence: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default AddUsersModal;
