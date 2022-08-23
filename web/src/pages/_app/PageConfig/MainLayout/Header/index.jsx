import { memo } from 'react';
import * as routes from 'routes';
import {
  Header as LayoutHeader,
  Text,
  Group
} from '@mantine/core';
import { Link } from 'components';

import AdminMenu from './components/AdminMenu';

const Header = () => (
  <LayoutHeader
    component="header"
    sx={(theme) => ({
      minHeight: '72px',
      padding: '0 32px',
      backgroundColor: theme.black,
      display: 'flex',
      alignItems: 'center',
      flex: '0 1 auto',
    })}
  >
    <Group>
      <Link type="router" href={routes.route.home} underline={false}>
        <Text color="white" size='lg' weight={700}>Feature flags</Text>
      </Link>
      <Link type="router" href={routes.route.apiKey} underline={false}>
        <Text color="white" size='lg' weight={700}>Api Keys</Text>
      </Link>
    </Group>
    <AdminMenu />
  </LayoutHeader>
);

export default memo(Header);
