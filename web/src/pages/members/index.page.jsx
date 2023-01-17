import { useCallback, useMemo } from 'react';
import trim from 'lodash/trim';
import cloneDeep from 'lodash/cloneDeep';
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
  Paper,
  ScrollArea,
  Table,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons';
import { useQueryClient } from 'react-query';

import { handleError } from 'helpers';
import { companyApi } from 'resources/company';
import { useAmplitude } from 'contexts/amplitude-context';
import MemberMenu from './components/delete-menu';
import PermissionsMenu from './components/permissions-menu';

import { useStyles } from './styles';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.'),
});

const columns = [
  { title: 'Email', sx: { maxWidth: '180px', width: '180px' } },
  { title: 'First name' },
  { title: 'Last name' },
  { title: 'Permissions' },
  { title: '' },
];

const Members = () => {
  const { classes } = useStyles();
  const modals = useModals();
  const queryClient = useQueryClient();
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const companyId = currentAdmin.currentCompany._id;
  const { data, isLoading } = companyApi.useGetMembers();

  const amplitude = useAmplitude();

  const matches = useMediaQuery('(max-width: 768px)');

  const {
    register, handleSubmit, formState: { errors }, setError, reset,
  } = useForm({ resolver: yupResolver(schema) });

  const membersList = useMemo(() => {
    if (!data) {
      return [];
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
          amplitude.track('Invite member');

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
    modals.openConfirmModal({
      title: (<Title order={3}>Delete invitation</Title>),
      centered: true,
      children: (
        <Text>
          <Text weight={700} component="span">{`Chancel invitation for ${email}?`}</Text>
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'subtle' },
      cancelProps: { variant: 'subtle' },
      onConfirm: () => cancelInvitationMutation.mutate({ email }, {
        onSuccess: () => {
          showNotification({
            title: 'Success',
            message: `The invitation for ${email} has been canceled.`,
            color: 'green',
          });
        },
        onError: (e) => handleError(e, setError),
      }),
    });
  };

  const removeMemberMutation = companyApi.useRemoveMember();
  const {
    mutate: changeMemberPermissions,
    isLoading: isPermissionsLoading,
  } = companyApi.useChangeMemberPermissions(companyId);

  const handleMemberRemove = useCallback((_id, email) => () => {
    modals.openConfirmModal({
      title: (<Title order={3}>Delete invitation</Title>),
      centered: true,
      children: (
        <Text>
          <Text weight={700} component="span">{`Remove team member ${email}?`}</Text>
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'subtle' },
      cancelProps: { variant: 'subtle' },
      onConfirm: () => removeMemberMutation.mutate({ _id }, {
        onSuccess: () => {
          showNotification({
            title: 'Success',
            message: `The team member ${email} has been removed.`,
            color: 'green',
          });
        },
        onError: (e) => handleError(e, setError),
      }),
    });
  }, [removeMemberMutation, setError, modals]);

  const getMemberPermissions = useCallback((permissions) => Object.entries(permissions[companyId])
    .filter(([, enabled]) => !!enabled)
    .map((obj) => obj[0]), [companyId]);

  const onPermissionChanged = (memberId) => (enabledPermissions) => {
    changeMemberPermissions({ memberId, enabledPermissions });
  };

  if (matches) {
    return (
      <>
        <Head>
          <title>Team members</title>
        </Head>
        {isLoading ? <Loader /> : (
          <Stack spacing={16}>
            <Title order={4} sx={{ paddingTop: 24 }}>Team members</Title>
            {currentAdmin?.ownCompanyId && (
              <Group className={classes.headerGroup} spacing={12}>
                <TextInput
                  {...register('email')}
                  icon={<IconSearch size={16} />}
                  placeholder="Enter email"
                  error={errors?.email?.message}
                  className={classes.search}
                />
                <Button
                  className={classes.addButton}
                  variant="light"
                  loading={inviteMemberMutation.isLoading}
                  sx={{ borderRadius: 12, fontSize: 18 }}
                  onClick={handleSubmit(handleInvite)}
                >
                  Invite
                </Button>
              </Group>
            )}

            <Paper radius="sm">
              <ScrollArea pb={20}>
                <Stack spacing={8}>
                  {membersList.map(({
                    _id,
                    email,
                    firstName,
                    lastName,
                    isInvitation,
                    permissions,
                  }) => (
                    <Stack key={_id} className={classes.itemBlock}>
                      <Group sx={{ justifyContent: 'space-between' }}>
                        <Text size="sm" weight={600}>
                          {email}
                        </Text>
                        <Group sx={{ justifyContent: 'flex-end' }}>
                          {
                            !isInvitation
                            && currentAdmin?.ownCompanyId
                            && _id !== currentAdmin?._id
                            && (
                              <>
                                <MemberMenu
                                  onDelete={handleMemberRemove(_id, email)}
                                  loading={removeMemberMutation.isLoading}
                                />
                                <PermissionsMenu
                                  onPermissionChanged={onPermissionChanged(_id)}
                                  disabled={isPermissionsLoading}
                                  permissions={getMemberPermissions(permissions)}
                                />
                              </>
                            )
                          }
                          {isInvitation && (
                            <MemberMenu
                              onDelete={handleCancelInvitation(email)}
                              loading={cancelInvitationMutation.isLoading}
                            />
                          )}
                        </Group>
                      </Group>
                      <Group>
                        {isInvitation
                          && <Badge className={classes.badge} variant="light">Pending invitation</Badge>}
                        {currentAdmin?.ownCompanyId && _id === currentAdmin?._id
                          && <Badge className={classes.badge} variant="filled">Company Owner</Badge>}
                      </Group>
                      {firstName && (
                        <Text size="sm" weight={600}>
                          {`${firstName} ${lastName}`}
                        </Text>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </ScrollArea>
            </Paper>
          </Stack>
        )}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Team members</title>
      </Head>
      {isLoading ? <Loader /> : (
        <Stack spacing="lg">
          <Title order={2}>Team members</Title>
          {currentAdmin?.ownCompanyId && (
          <Group sx={{ width: '100%' }}>
            <TextInput
              {...register('email')}
              icon={<IconSearch size={16} />}
              placeholder="Enter email"
              error={errors?.email?.message}
              className={classes.search}
            />
            <Button
              variant="light"
              loading={inviteMemberMutation.isLoading}
              sx={{ borderRadius: 12, fontSize: 16 }}
              onClick={handleSubmit(handleInvite)}
            >
              Send invite
            </Button>
          </Group>
          )}

          <Paper radius="sm" withBorder>
            <ScrollArea>
              <Table
                horizontalSpacing="xl"
                verticalSpacing="lg"
                className={classes.table}
              >
                <thead>
                  <tr>
                    {columns.map(({ title, sx }) => (
                      <th key={title} style={sx}>{title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {membersList.map(
                    ({
                      _id,
                      email,
                      firstName,
                      lastName,
                      isInvitation,
                      permissions,
                      ownCompanyId,
                    }) => {
                      const isAdminCompanyOwner = ownCompanyId === companyId;
                      const isHavePermission = !!currentAdmin?.permissions[companyId].manageMembers;

                      return (
                        <tr key={_id}>
                          <td>
                            <Group>
                              <Text size="sm" weight={600}>
                                {email}
                              </Text>
                              {isInvitation
                                && <Badge variant="light" className={classes.badge}>Pending invitation</Badge>}
                              {currentAdmin?.ownCompanyId && _id === currentAdmin?._id
                                && <Badge className={classes.badge} variant="filled">Company Owner</Badge>}
                            </Group>
                          </td>
                          <td>
                            <Text size="sm" weight={600}>
                              {firstName}
                            </Text>
                          </td>
                          <td>
                            <Text size="sm" weight={600}>
                              {lastName}
                            </Text>
                          </td>
                          <td>
                            {!isAdminCompanyOwner && (
                            <PermissionsMenu
                              onPermissionChanged={onPermissionChanged(_id)}
                              disabled={isPermissionsLoading}
                              permissions={getMemberPermissions(permissions)}
                            />
                            )}
                          </td>
                          <td>
                            <Group sx={{ justifyContent: 'flex-end' }}>
                              {
                                !isInvitation
                                && isHavePermission
                                && _id !== currentAdmin?._id
                                && (
                                  <MemberMenu
                                    onDelete={handleMemberRemove(_id, email)}
                                    loading={removeMemberMutation.isLoading}
                                  />
                                )
                              }
                              {isInvitation && (
                                <MemberMenu
                                  onDelete={handleCancelInvitation(email)}
                                  loading={cancelInvitationMutation.isLoading}
                                />
                              )}
                            </Group>
                          </td>
                        </tr>
                      );
                    },
                  )}
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
