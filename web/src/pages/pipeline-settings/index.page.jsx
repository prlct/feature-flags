import { useState } from 'react';
import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Space,
  Table,
  Text,
  Menu,
  ActionIcon,
  Title,
} from '@mantine/core';
import config from 'config';
import queryClient from 'query-client';
import { IconSettings, IconTrash } from '@tabler/icons';
import { openContextModal, useModals } from '@mantine/modals';
import { useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';

import CardSettingsButton from 'pages/email-sequences/components/card-settings-button';
import {
  useGetSenderEmails,
  useGetApplicationEvents,
  useDeleteEvent,
  useRemoveSenderEmail,
} from 'resources/email-sequence/email-sequence.api';
import GoogleButton from 'components/google-button/google-button';
import EventCreateModal from './components/event-create-modal';
import { useStyles } from './styles';

const PipelineSettings = () => {
  const modals = useModals();
  const { classes } = useStyles();
  const matches = useMediaQuery('(max-width: 768px)');

  const { data: emails = [], isLoading } = useGetSenderEmails();
  const { data: fetchedEvents } = useGetApplicationEvents();
  const deleteEventMutation = useDeleteEvent();

  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin?.currentApplicationId;

  const [isEventCreateModalOpened, setIsEventCreateModalOpened] = useState(false);

  const deleteEvent = ({ label, value }) => {
    deleteEventMutation.mutate({ label, value }, {
      onSuccess: () => {
        showNotification({
          title: 'Success',
          message: 'Trigger event has been successfully deleted.',
          color: 'green',
        });
      },
      onError: () => {
        showNotification({
          title: 'Error',
          message: 'Trigger event is used in one of the sequence.',
          color: 'red',
        });
      },
    });
  };

  const handleEventDelete = (event) => {
    modals.openConfirmModal({
      title: (<Title order={3}>Delete event</Title>),
      centered: true,
      children: (
        <Text>
          Event
          {' '}
          <Text weight={700} component="span">{event?.label}</Text>
          {' '}
          will be deleted. Are you sure?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'subtle' },
      cancelProps: { variant: 'subtle' },
      onConfirm: () => deleteEvent(event),
    });
  };

  const handleEventSetting = (event) => {
    openContextModal({
      modal: 'updateEvent',
      size: 800,
      fullScreen: matches,
      title: 'Edit event',
      innerProps: { ...event },
      styles: { title: { fontSize: 20, fontWeight: 600 } },
    });
  };

  const { mutate: removeEmail } = useRemoveSenderEmail();

  const removeEmailHandler = async (email) => {
    modals.openConfirmModal({
      title: (<Title order={3}>Delete email</Title>),
      centered: true,
      children: (
        <Text>
          {`Email ${email} will be deleted. Are you sure?`}
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'subtle' },
      cancelProps: { variant: 'subtle' },
      onConfirm: () => removeEmail(email, {
        onSuccess: () => {
          queryClient.invalidateQueries(['sender-emails']);
        },
      }),
    });
  };
  const companyId = currentAdmin?.currentCompany._id;
  const isCurrentAdminOwner = currentAdmin?.currentCompany?._id === currentAdmin?.ownCompanyId;
  const isCurrentAdminCanManageEmails = isCurrentAdminOwner
    || currentAdmin?.permissions?.[companyId]?.manageSenderEmails;

  const emailsRows = emails.map((email) => (
    <tr key={email}>
      <td>{email.value}</td>
      {isCurrentAdminCanManageEmails && (
        <td>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon
                title="Settings"
                variant="transparent"
                sx={{ width: '100%', justifyContent: 'flex-end' }}
              >
                <CardSettingsButton />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                icon={<IconTrash color="red" icon={<IconTrash />} />}
                onClick={() => removeEmailHandler(email.value)}
                sx={{ padding: '20px 13px' }}
                className={classes.menuItem}
              >
                Remove
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </td>
      )}
    </tr>
  ));

  const eventsRows = fetchedEvents?.events?.map((event) => (
    <tr key={event.label}>
      <td>{event.label}</td>
      <td>{event.value}</td>
      <td>
        <Menu position="bottom-end">
          <Menu.Target>
            <ActionIcon
              title="Settings"
              variant="transparent"
              sx={{ width: '100%', justifyContent: 'flex-end' }}
            >
              <CardSettingsButton />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              icon={<IconSettings size={14} />}
              onClick={() => handleEventSetting(event)}
              sx={{ padding: '20px 13px' }}
              className={classes.menuItem}
            >
              Settings
            </Menu.Item>
            <Menu.Item
              icon={<IconTrash size={14} />}
              color="red"
              onClick={() => handleEventDelete(event)}
              sx={{ padding: '20px 13px' }}
              className={classes.menuItem}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  return (
    <Box>
      <LoadingOverlay visible={isLoading} />
      <Group sx={{ justifyContent: 'space-between' }}>
        <Text my={8}>Application emails</Text>
        {isCurrentAdminCanManageEmails && (
          <GoogleButton
            href={`${config.apiUrl}/applications/${applicationId}/add-gmail`}
          >
            Add Google email
          </GoogleButton>
        )}
      </Group>

      <Table verticalSpacing="xs" horizontalSpacing="xs" striped>
        <thead>
          <tr>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <th />
            {currentAdmin?.ownCompanyId && (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <th />
            )}
          </tr>
        </thead>
        <tbody>
          {emailsRows}
        </tbody>
      </Table>

      <Space h={24} />
      <Group sx={{ justifyContent: 'space-between' }}>
        <Text my={8}>Application events</Text>
        <Button
          onClick={() => setIsEventCreateModalOpened(true)}
        >
          + Add event
        </Button>
      </Group>

      <Table verticalSpacing="xs" horizontalSpacing="xs" striped sx={{ '& td:last-child': { width: '5%' } }}>
        <thead>
          <tr>
            <th>Event name</th>
            <th>Key</th>
          </tr>
        </thead>
        <tbody>
          {eventsRows}
        </tbody>
      </Table>

      <EventCreateModal
        opened={isEventCreateModalOpened}
        onClose={() => setIsEventCreateModalOpened(false)}
      />
    </Box>
  );
};

export default PipelineSettings;
