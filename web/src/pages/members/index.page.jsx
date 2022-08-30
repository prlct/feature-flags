import { useCallback } from 'react';
import { trim } from 'lodash';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Head from 'next/head';
import {
  Title,
  Stack,
  Loader,
  TextInput,
  Button,
  Text,
  Group,
  Badge,
  ActionIcon,
  Tooltip,
  Paper,
  ScrollArea,
  Table,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';


import { handleError } from 'helpers';
import { companyApi } from 'resources/company';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.'),
});

const columns = ['Email', 'First name', 'Last name'];

const Members = () => {
  const {
    register, handleSubmit, formState: { errors }, setError, reset,
  } = useForm({ resolver: yupResolver(schema) });

  const { data, isLoading } = companyApi.useGetMembers();
  const { members, invitations } = data || {};

  const inviteMemberMutation = companyApi.useInviteMember();

  const handleInvite = ({ email }) => {
    const trimmedEmail = trim(email);

    if (trimmedEmail) {
      inviteMemberMutation.mutate({ email: trimmedEmail }, {
        onSuccess: () => {
          reset({ email: '' });

          showNotification({
            title: 'Success',
            message: `The invitation has been sent to ${email}.`,
            color: 'green',
          });
        },
        onError: (e) => handleError(e, setError),
      });
    }
  };

  const handleInvitationCancel = useCallback((id) => () => {

  }, []);

  return (
    <>
      <Head>
        <title>Team members</title>
      </Head>
      {isLoading ? <Loader /> : (
        <Stack spacing="lg">
          <Title order={2}>Team members</Title>
          <Title order={4}>Current members</Title>

          <Paper radius="sm" withBorder>
            <ScrollArea>
              <Table
                horizontalSpacing="xl"
                verticalSpacing="lg"
              >
                <thead>
                  <tr>
                    {columns.map((title) => (
                      <th key={title}>{title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map(({ _id, email, firstName, lastName }) => (
                    <tr key={_id}>
                      <td>
                        <Text size="md" weight={700}>
                          {email}
                        </Text>
                      </td>
                      <td>
                        <Text size="md" weight={700}>
                          {firstName}
                        </Text> 
                      </td>
                      <td>
                        <Text size="md" weight={700}>
                          {lastName}
                        </Text> 
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
          <Stack sx={{ maxWidth: '600px' }}>
            <TextInput
              label={
                <Title order={4}>Invite member</Title>
              }
              {...register('email')}
              placeholder="Enter email"
              error={errors?.email?.message}
              rightSectionWidth="200"
              rightSection={
                <Button
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0  }}
                  onClick={handleSubmit(handleInvite)}
                >
                  Invite
                </Button>
              }
            />
          </Stack>

          {
            invitations?.length && (
              <>
                <Title order={4}>Active invitations</Title>
                <ScrollArea style={{ height: 300 }}>
                  <Group spacing="sm" sx={{ maxWidth: '1000px' }}>
                    {invitations.map(({ _id, email }) => (
                      <Badge sx={{ height: 26 }} key={_id} variant="outline" rightSection={
                        <Tooltip label="Cancel invitation" withArrow position="right">
                          <ActionIcon
                            sx={{ marginTop: 4 }}
                            size="xs"
                            color="blue"
                            radius="xl"
                            variant="transparent"
                            onClick={handleInvitationCancel(_id)}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                        </Tooltip>
                      }>
                        {email}
                      </Badge>
                    ))}
                  </Group>
                </ScrollArea>
              </>
            )
          }
        </Stack>
      )}
    </>
  );
};

export default Members;
