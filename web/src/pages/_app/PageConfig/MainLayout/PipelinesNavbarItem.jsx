import { Accordion, ActionIcon, Divider, Group, Text } from '@mantine/core';

import { Link } from 'components';
import * as routes from 'routes';
import { IconFilter } from '@tabler/icons';

import router from 'next/router';

import { useStyles } from './styles';

const PipelinesNavbarItem = () => {
  const items = [
    {
      name: 'Pipelines',
      route: routes.route.emailSequences,
    },
    {
      name: 'Users',
      route: routes.route.pipelineUsers,
    },
  ];

  const { classes } = useStyles();

  return (
    <Accordion
      variant="filled"
      styles={{
        item: { backgroundColor: 'transparent !important' },
        control: { padding: 0, color: '#424242' },
      }}
    >
      <Accordion.Item value="pipelines">
        <Accordion.Control
          icon={(
            <ActionIcon
              radius="md"
              variant="transparent"
              size={40}
              className={[
                classes.tabIcon,
              ]}
            >
              <IconFilter />
            </ActionIcon>
          )}
        >
          <Text size="sm">Activation&nbsp;pipelines</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Group
            pl={16}
            direction="column"
            position="left"
            spacing={0}
          >
            {items.map((item) => (
              <Link
                key={item.route}
                href={item.route}
                underline={false}
                type="router"
                pl={4}
                style={{ width: '100%' }}
              >
                <Group style={{ height: '32px' }}>
                  <Divider orientation="vertical" size="xs" />
                  <Text
                    size="sm"
                    className={[
                      classes.label,
                      item.route === router.route && classes.activeLabel,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Group>
              </Link>
            ))}
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default PipelinesNavbarItem;
