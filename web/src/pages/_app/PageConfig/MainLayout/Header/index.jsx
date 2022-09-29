import { memo } from 'react';
import * as routes from 'routes';
import {
  Header as LayoutHeader,
  Text,
  Group,
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import AdminMenu from './components/AdminMenu';
import EnvSelect from './components/EnvSelect';
import CallToActionBanner from './components/CallToActionBanner';

const Header = () => (
  <>
    <LayoutHeader
      component="header"
      height={72}
      p="sm"
      sx={(theme) => ({
        minHeight: '72px',
        backgroundColor: theme.black,
        display: 'flex',
        alignItems: 'center',
        flex: '0 1 auto',
      })}
    >
      <Group spacing={36}>
        <Link type="router" href={routes.route.home} underline={false}>
          <LogoImage />
        </Link>
        <Link type="router" href={routes.route.home} underline={false}>
          <Text color="white" size="lg">Feature flags</Text>
        </Link>
        <Link type="router" href={routes.route.apiKey} underline={false}>
          <Text color="white" size="lg">Api Keys</Text>
        </Link>
        <Link type="router" href={routes.route.members} underline={false}>
          <Text color="white" size="lg">Team members</Text>
        </Link>
      </Group>
      <Group spacing="lg" sx={{ marginLeft: 'auto' }}>
        <EnvSelect />
        <AdminMenu />
      </Group>
    </LayoutHeader>
    {/* <CallToActionBanner /> */}
  </>
);

export default memo(Header);
