import PropTypes from 'prop-types';
import { IconEdit, IconPlayerPlay, IconPlayerStop, IconSend, IconTrash } from '@tabler/icons';
import { Card, Group, Stack, Text, Menu, Box } from '@mantine/core';

import { openContextModal, useModals } from '@mantine/modals';
import { useMediaQuery } from '@mantine/hooks';

import { useAmplitude } from 'contexts/amplitude-context';
import { useGrowthFlags } from 'contexts/growth-flags-context';
import * as emailSequencesApi from 'resources/email-sequence/email-sequence.api';

import CardSettingsButton from './card-settings-button';
import DayBadge from './day-badge';
import EmailProgressBar from './email-progress-bar';

const EmailCard = (props) => {
  const { email } = props;
  const {
    name,
    enabled,
    sent,
    converted = 0,
    unsubscribed = 0,
    clicked = 0,
    delayDays,
    _id,
    allowRedirect,
  } = email;
  const modals = useModals();

  const matches = useMediaQuery('(max-width: 768px)');
  const amplitude = useAmplitude();
  const growthflags = useGrowthFlags();

  const textColor = enabled ? 'gray' : '#ddd';

  const handleEmailToggle = emailSequencesApi.useEmailToggle(_id).mutate;
  const handleEmailRemoveMutation = emailSequencesApi.useEmailRemove(_id).mutate;

  const handleEmailRemove = () => {
    modals.openConfirmModal({
      title: 'Remove email',
      children: !sent
        ? 'Are you sure you want to remove this email?'
        : <Text align="center">⚠️ Please, pay attention! This email has been already sent. Removing may affect analytical data. We suggest disabling it.</Text>,
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'subtle' },
      cancelProps: { variant: 'subtle' },
      centered: true,
      onConfirm: () => handleEmailRemoveMutation(),
    });
  };

  const enabledMenuIcon = enabled ? <IconPlayerStop size={16} /> : <IconPlayerPlay size={16} />;

  return (
    <Stack style={{ position: 'relative' }}>
      <DayBadge days={delayDays} />
      <Card shadow="sm" withBorder sx={{ position: 'relative', color: textColor, borderRadius: 12 }}>
        <Stack spacing={0}>
          <Group position="apart" sx={{ '& .mantine-Modal-inner': { padding: 0 } }}>
            <Text size={matches ? 16 : 18} weight={600} color={textColor} style={{ lineHeight: '22px' }}>{name}</Text>
            <Menu withinPortal position={matches ? 'bottom-end' : 'bottom'} width={matches && 190}>
              <Menu.Target>
                <CardSettingsButton />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  icon={!matches && enabledMenuIcon}
                  onClick={() => handleEmailToggle(undefined, { onSuccess: (email) => {
                    if (email.enabled) {
                      amplitude.track('Sequence email enabled');
                      growthflags?.triggerEvent('email-enabled');
                    }
                  } })}
                >
                  {enabled ? 'Disable' : 'Enable'}
                </Menu.Item>
                <Menu.Item
                  icon={!matches && <IconEdit size={16} />}
                  onClick={() => openContextModal({
                    modal: 'sequenceEmail',
                    innerProps: { email },
                    size: 800,
                    fullScreen: matches,
                    styles: { title: { fontSize: 20, fontWeight: 600 } },
                    closeOnClickOutside: false,
                    closeOnEscape: false,
                  })}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  icon={!matches && <IconSend size={16} />}
                  onClick={() => openContextModal({ modal: 'sendTestEmail', innerProps: { email } })}
                >
                  Send a test email
                </Menu.Item>
                <Menu.Item
                  icon={!matches && <IconTrash size={16} color="red" />}
                  onClick={handleEmailRemove}
                  sx={{ color: 'red' }}
                >
                  Remove
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Box>
            <EmailProgressBar converted={converted} dropped={unsubscribed} sent={sent} />
            {allowRedirect && (
            <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
              <Text sx={{ alignSelf: 'flex-end' }} size="sm">
                Clicked:&nbsp;
                <Text component="span" weight="bold">{clicked}</Text>
              </Text>
            </Box>
            )}
          </Box>
        </Stack>
        {!enabled && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Text size="sm" p={2} color="#ddd">Draft</Text>
          </Box>
        )}
      </Card>
    </Stack>
  );
};

EmailCard.propTypes = {
  email: PropTypes.shape({
    _id: PropTypes.string,
    delayDays: PropTypes.number,
    name: PropTypes.string,
    enabled: PropTypes.bool,
    allowRedirect: PropTypes.bool,
    sent: PropTypes.number,
    converted: PropTypes.number,
    clicked: PropTypes.number,
    unsubscribed: PropTypes.number,
  }).isRequired,
};

export default EmailCard;
