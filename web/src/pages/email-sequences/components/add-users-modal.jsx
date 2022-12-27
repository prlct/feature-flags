import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Stack, TextInput, Text, Group, Button, useMantineTheme, Table, Box, SegmentedControl, FileButton, ActionIcon } from '@mantine/core';
import { IconCheck, IconUpload, IconX } from '@tabler/icons';
import { Dropzone } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import * as Papa from 'papaparse';
import { useMediaQuery } from '@mantine/hooks';

import { useAddUsersList } from 'resources/email-sequence/email-sequence.api';
import PropTypes from 'prop-types';
import { camelCase } from 'lodash/string';
import trim from 'lodash/trim';
import { DeleteAlt, UploadCSV } from 'public/icons';
import { yupResolver } from '@hookform/resolvers/yup';

import { useStyles } from './styles';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.').required('Field is required.'),
  firstName: yup.string(),
  lastName: yup.string(),
});

const AddUsersModal = ({ context, id, innerProps }) => {
  const { sequence } = innerProps;
  const { classes } = useStyles();
  const matches = useMediaQuery('(max-width: 768px)');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const sequenceId = sequence._id;
  const handleAddUsersList = useAddUsersList(sequenceId).mutate;
  const [users, setUsersList] = useState([]);
  const [fileCSV, setFileCSV] = useState(null);
  const [toggle, setToggle] = useState('email');
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

  const readFile = (uploadFile) => {
    setFileCSV(uploadFile);

    const commonConfig = {
      header: true,
      transformHeader: (header) => camelCase(trim(header)),
    };

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
  };

  const rejected = () => {
    showNotification({
      title: 'File was rejected',
      message: 'File was rejected',
      color: 'red',
    });
  };

  const onAddUser = (data) => {
    const users = Array(1).fill(data);
    if (data.email) {
      addUsersList({ usersList: users, sequenceId });
    }
  };

  const onAddUsersList = () => {
    if (users.length) {
      addUsersList({ usersList: users, sequenceId });
    } else {
      showNotification({
        title: 'File is empty',
        message: 'File is empty',
        color: 'red',
      });
    }
  };

  const handleDeleteFile = () => {
    setFileCSV(null);
    setUsersList([]);
  };

  if (toggle === 'email') {
    return (
      <Stack spacing={24}>
        <SegmentedControl
          value={toggle}
          data={[
            { label: 'Email', value: 'email' },
            { label: 'Import list', value: 'import list' },
          ]}
          onChange={setToggle}
          color="primary"
          radius={8}
          sx={{ backgroundColor: '#F1EDF8' }}
        />

        <form id="addUser" onSubmit={handleSubmit(onAddUser)}>
          <TextInput
            {...register('email')}
            label="Email"
            placeholder="some@email.com"
            type="email"
            sx={{ paddingBottom: 24 }}
            error={errors?.email?.message}
          />
          <TextInput
            {...register('firstName')}
            label="First name"
            type="text"
            sx={{ paddingBottom: 24 }}
          />
          <TextInput
            {...register('lastName')}
            label="Last name"
            type="text"
          />
        </form>

        <Group position="apart" sx={{ justifyContent: matches ? 'space-between' : 'flex-end' }}>
          <Button variant="subtle" color="black" onClick={() => context.closeModal(id)}>
            Cancel
          </Button>
          <Button variant="light" form="addUser" type="submit">
            Save
          </Button>
        </Group>
      </Stack>
    );
  }

  return (
    <Stack spacing={24}>
      <SegmentedControl
        value={toggle}
        data={[
          { label: 'Email', value: 'email' },
          { label: 'Import list', value: 'import list' },
        ]}
        onChange={setToggle}
        color="primary"
        radius={8}
        sx={{ backgroundColor: '#F1EDF8' }}
      />

      <Box sx={{ width: '100%' }}>
        <Text size="sm" inline weight={500}>
          Please follow this format in the table
        </Text>
        <Table
          fontSize="xs"
          verticalSpacing="xs"
          withColumnBorders
          className={classes.fileFormat}
        >
          <thead>
            <tr>
              <th>Email</th>
              <th>First name</th>
              <th>Last name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td />
              <td />
              <td />
            </tr>
          </tbody>
        </Table>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Text size="sm" inline sx={{ paddingBottom: 8 }} weight={500}>
          Upload import list
        </Text>
        {matches ? (
          <>
            {fileCSV && (
            <Group
              position="center"
              spacing="xl"
              style={{
                paddingTop: 16,
                minHeight: 36,
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Group spacing={6} sx={(theme) => ({ '& svg': { color: theme.colors.primary[4], strokeWidth: 3 } })}>
                <IconCheck size={16} />
                <Text size="sm" inline>
                  {fileCSV?.name}
                </Text>
              </Group>
              <Group spacing={7}>
                <Text size="sm" inline>
                  {`${fileCSV?.size} kb`}
                </Text>
                <ActionIcon size="sx" onClick={handleDeleteFile}><DeleteAlt /></ActionIcon>
              </Group>

            </Group>
            )}
            <FileButton
              onChange={(files) => readFile(files)}
              accept="text/csv"
              sx={{ marginTop: 16, width: '100%' }}
            >
              {(props) => <Button variant="light" {...props}>Upload .csv</Button>}
            </FileButton>
          </>

        ) : (
          <Group className={classes.uploadZone}>
            <Dropzone
              onDrop={(files) => readFile(files[0])}
              onReject={() => rejected()}
              maxFiles={1}
              maxSize={3 * 1024 ** 2}
              accept={['text/csv']}
              className={classes.dropZone}
            >
              <Group position="center" spacing="md" style={{ minHeight: 50, pointerEvents: 'none' }}>
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
                  <UploadCSV />
                </Dropzone.Idle>

                <Box sx={{ width: '100%' }}>
                  <Text size="sm" inline align="center">
                    Drop files here or
                    {' '}
                    <Text span color="primary" inherit>click</Text>
                    {' '}
                    to upload .csv file
                  </Text>
                  <Text size="xs" inline align="center">
                    Max file size 5 mb.
                  </Text>
                </Box>
              </Group>
            </Dropzone>
            {fileCSV && (
            <Group
              position="center"
              spacing="xl"
              style={{
                paddingTop: 15,
                minHeight: 36,
                width: '100%',
                justifyContent: 'space-between',
                borderTop: '1px solid #D4D8DD',
              }}
            >
              <Group spacing={6} sx={(theme) => ({ '& svg': { color: theme.colors.primary[4], strokeWidth: 3 } })}>
                <IconCheck size={16} />
                <Text size="sm" inline>
                  {fileCSV?.name}
                </Text>
              </Group>
              <Group spacing={7}>
                <Text size="sm" inline>
                  {`${fileCSV?.size} kb`}
                </Text>
                <ActionIcon size="sx" onClick={handleDeleteFile}><DeleteAlt /></ActionIcon>
              </Group>

            </Group>
            )}
          </Group>
        )}
      </Box>

      <Group position="apart" sx={{ justifyContent: matches ? 'space-between' : 'flex-end' }}>
        <Button variant="subtle" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button variant="light" onClick={onAddUsersList}>
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
