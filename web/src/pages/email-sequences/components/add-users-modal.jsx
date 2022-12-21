import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Stack, TextInput, Text, Group, Button, Accordion, useMantineTheme, Table, Box } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import * as Papa from 'papaparse';

import { useAddUsersList } from 'resources/email-sequence/email-sequence.api';
import PropTypes from 'prop-types';

const AddUsersModal = ({ context, id, innerProps }) => {
  const { sequence } = innerProps;

  const {
    register,
    handleSubmit,
  } = useForm();

  const sequenceId = sequence._id;
  const handleAddUsersList = useAddUsersList(sequenceId).mutate;
  const [users, setUsersList] = useState([]);
  const [fileCSV, setFileCSV] = useState(null);
  const theme = useMantineTheme();

  const addUsersList = ({ usersList, sequenceId }) => {
    handleAddUsersList({ usersList, sequenceId }, {
      onSuccess: () => {
        context.closeModal(id);
      },
      onError: () => {
        setUsersList([]);
        setFileCSV(null);
      },
    });
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
          setUsersList([...users, ...result.data.slice(0, -1)]);
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

  const onAddUser = (data) => {
    let usersList = users;
    if (data.email) {
      usersList = [...usersList, data];
    }
    addUsersList({ usersList, sequenceId });
  };

  return (
    <Stack>
      <Accordion>
        <Accordion.Item value="addUsers">
          <Accordion.Control>Add users</Accordion.Control>
          <Accordion.Panel>
            <form id="addUser" onSubmit={handleSubmit(onAddUser)}>
              <TextInput
                {...register('email')}
                label="Email"
                placeholder="some@email.com"
                type="email"
              />
              <TextInput
                {...register('first name')}
                label="First name"
                placeholder="Enter first name"
                type="text"
              />
              <TextInput
                {...register('last name')}
                label="Last name"
                placeholder="Enter last name"
                type="text"
              />
            </form>

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

                  <Box sx={{ width: '100%' }}>
                    <Text size="sm" inline>
                      Drag or click to select cvs file in format
                    </Text>
                    <Table
                      fontSize="xs"
                      verticalSpacing="xs"
                      withColumnBorders
                      sx={{ lineHeight: '10px' }}
                    >
                      <thead>
                        <tr>
                          <th>email</th>
                          <th>first name</th>
                          <th>last name</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>some@email.com</td>
                          <td>John</td>
                          <td>Smith</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Box>
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
        <Button form="addUser" type="submit">
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
