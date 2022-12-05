import { useContext } from 'react';
import PropTypes from 'prop-types';
import { IconEdit, IconPlayerPlay, IconTrash } from '@tabler/icons';
import { Card, Group, Space, Stack, Text, Menu, Box } from '@mantine/core';

import CardSettingsButton from './card-settings-button';
import DayBadge from './day-badge';

const UNSUBSCRIBE_SHOW_THRESHOLD = 10;

const EmailCard = (props) => {
  const { email } = props;
  const {
    name,
    enabled,
    sent,
    unsubscribed,
    delay,
    id,
  } = email;

  const { openEditEmailModal, toggleEmailEnabled, removeEmail } = useContext(EmailSequencesContext);

  const textColor = enabled ? 'gray' : 'dimmed';

  const unsubPercentage = ((unsubscribed / sent) * 100).toFixed(2);

  return (
    <Stack style={{ position: 'relative' }}>
      <DayBadge days={delay} />
      <Card shadow="sm" withBorder sx={{ position: 'relative', color: textColor, borderRadius: 12 }}>
        <Stack spacing={0}>
          <Group position="apart">
            <Text size={18} weight={600} color={enabled ? '#17181A' : 'dimmed'} style={{ lineHeight: '22px' }}>{name}</Text>
            <Menu withinPortal>
              <Menu.Target>
                <CardSettingsButton />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  icon={<IconPlayerPlay size={16} />}
                  onClick={() => toggleEmailEnabled(email)}
                >
                  {enabled ? 'Disable' : 'Enable'}
                </Menu.Item>
                <Menu.Item icon={<IconEdit size={16} />} onClick={() => openEditEmailModal(email)}>
                  Edit
                </Menu.Item>
                <Menu.Item icon={<IconTrash size={16} color="red" />} onClick={() => removeEmail(id)}>
                  Remove
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Space h="sm" />
          <Space h="sm" />
          <Group position="apart">
            <Text size={14} color="#797C80" style={{ lineHeight: '20px' }}>
              Sent:
            </Text>
            <Text size={14} weight="bold" color={textColor} style={{ lineHeight: '20px' }}>
              {sent}
            </Text>
          </Group>
          {unsubPercentage >= UNSUBSCRIBE_SHOW_THRESHOLD && (
          <Group position="apart">
            <Text size={14} color="#797C80" style={{ lineHeight: '20px' }}>
              Unsubscribes:
            </Text>
            <Text size={14} weight={600} color={textColor} mt={8} style={{ lineHeight: '20px' }}>
              {`${unsubPercentage}%`}
            </Text>
          </Group>
          )}
        </Stack>
        {!enabled && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Text size="sm" p={2} color="dimmed">Draft</Text>
          </Box>
        )}
      </Card>
    </Stack>
  );
};

EmailCard.propTypes = {
  email: PropTypes.shape({
    id: PropTypes.string,
    delay: PropTypes.number,
    name: PropTypes.string,
    enabled: PropTypes.bool,
    sent: PropTypes.number,
    unsubscribed: PropTypes.number,
  }).isRequired,
};

export default EmailCard;
