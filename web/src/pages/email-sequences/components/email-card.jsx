import PropTypes from 'prop-types';
import { IconEdit, IconPlayerPlay } from '@tabler/icons';
import { Card, Group, Space, Stack, Text, Menu, Box } from '@mantine/core';

import { useContext } from 'react';
import Arrow from './arrow';
import CardSettingsButton from './card-settings-button';
import { EmailSequencesContext } from '../email-sequences-context';

const UNSUBSCRIBE_SHOW_THRESHOLD = 10;

const EmailCard = (props) => {
  const { email } = props;
  const {
    name,
    enabled,
    sent,
    unsubscribed,
    delay,
  } = email;

  const { openEditEmailModal, toggleEmailEnabled } = useContext(EmailSequencesContext);

  const textColor = enabled ? 'black' : 'dimmed';

  const unsubPercentage = ((unsubscribed / sent) * 100).toFixed(2);

  return (
    <Stack>
      <Arrow days={delay} />
      <Card shadow="sm" p="sm" withBorder sx={{ position: 'relative', color: textColor }}>
        <Stack spacing={0}>
          <Group position="apart">
            <Text size="lg" weight="bold" color={textColor}>{name}</Text>
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
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Space h="sm" />
          <Space h="sm" />
          <Group position="apart">
            <Text size="sm" color={textColor}>
              Sent:
            </Text>
            <Text size="sm" weight="bold" color={textColor}>
              {sent}
            </Text>
          </Group>
          {unsubPercentage >= UNSUBSCRIBE_SHOW_THRESHOLD && (
          <Group position="apart">
            <Text size="sm" color={textColor}>
              Unsubscribes:
            </Text>
            <Text size="sm" weight="bold" color={textColor}>
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
