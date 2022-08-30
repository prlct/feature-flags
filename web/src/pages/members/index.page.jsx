import { useCallback, useMemo } from 'react';
import { trim, cloneDeep } from 'lodash';
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
import { IconTrash } from '@tabler/icons';
import { useQueryClient } from 'react-query';

import { handleError } from 'helpers';
import { companyApi } from 'resources/company';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.'),
});

const columns = ['Email', 'First name', 'Last name', 'Actions'];

const Members = () => {
  const queryClient = useQueryClient();
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const { data, isLoading } = companyApi.useGetMembers();
  
  const {
    register, handleSubmit, formState: { errors }, setError, reset,
  } = useForm({ resolver: yupResolver(schema) });

  const membersList = useMemo(() => {
    if (!data) {
      return []
    }

    const list = [
      ...cloneDeep(data.members),
      ...cloneDeep(data.invitations).map((m) => ({ ...m, isInvitation: true })),
    ];

    return list;
  }, [data]);

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

  const cancelInvitationMutation = companyApi.useCancelInvitation();

  const handleCancelInvitation = (email) => () => {
    const isConfirmed = confirm(`Chancel invitation for ${email}?`);

    if (!isConfirmed) {
      return;
    }

    cancelInvitationMutation.mutate({ email }, {
      onSuccess: () => {
        showNotification({
          title: 'Success',
          message: `The invitation for ${email} has been canceled.`,
          color: 'green',
        });
      },
      onError: (e) => handleError(e, setError),
    });
  };

  const removeMemberMutation = companyApi.useRemoveMember();

  const handleMemberRemove = useCallback((_id, email) => () => {
    const isConfirmed = confirm(`Remove team member ${email}?`);

    if (!isConfirmed) {
      return;
    }

    removeMemberMutation.mutate({ _id }, {
      onSuccess: () => {
        showNotification({
          title: 'Success',
          message: `The team member ${email} has been removed.`,
          color: 'green',
        });
      },
      onError: (e) => handleError(e, setError),
    });
  }, []);

  return (
    <>
      <Head>
        <title>Team members</title>
      </Head>
      {isLoading ? <Loader /> : (
        <Stack spacing="lg">
          <Title order={2}>Team members</Title>
          <Stack sx={{ maxWidth: '600px' }}>
            <TextInput
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
                  {membersList.map(({ _id, email, firstName, lastName, isInvitation }) => (
                    <tr key={_id}>
                      <td>
                        <Group>
                          <Text size="md" weight={700}>
                            {email}
                          </Text>
                          {isInvitation && <Badge variant="light">Pending invitation</Badge>}
                          {
                            currentAdmin?.ownCompanyId && _id === currentAdmin?._id
                              && <Badge variant="light" color="grape">Company Owner</Badge>
                          }
                        </Group>
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
                      <td>
                        <Group sx={{ width: 50 }}>
                          {
                            !isInvitation && currentAdmin?.ownCompanyId && _id !== currentAdmin?._id && (
                              <Tooltip label="Remove member" withArrow position="right">
                                <ActionIcon
                                  loading={removeMemberMutation.isLoading}
                                  size="lg"
                                  color="red"
                                  variant="filled"
                                  onClick={handleMemberRemove(_id, email)}
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Tooltip>
                            )
                          }
                          {
                            isInvitation && (
                              <Tooltip label="Cancel invitation" withArrow position="right">
                                <ActionIcon
                                  loading={cancelInvitationMutation.isLoading}
                                  size="lg"
                                  color="red"
                                  variant="filled"
                                  onClick={handleCancelInvitation(email)}
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Tooltip>
                            )
                          }
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Stack>
      )}
    </>
  );
};

export default Members;
