import { memo } from 'react';
import * as routes from 'routes';
import {
  Header as LayoutHeader,
  Text,
} from '@mantine/core';
import { Link } from 'components';

import UserMenu from './components/UserMenu';

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
    <Link type="router" href={routes.route.home} underline={false}>
      <Text color="white" size='lg' weight={700}>Feature flags</Text>
    </Link>
    <UserMenu />
  </LayoutHeader>
);

export default memo(Header);
