import { memo } from 'react';
import { accountApi } from 'resources/account';
import { Menu } from '@mantine/core';
import { IconLogout } from '@tabler/icons';
import MenuToggle from '../MenuToggle';

const AdminMenu = () => {
  const { mutate: signOut } = accountApi.useSignOut();

  return (
    <Menu
      control={<MenuToggle />}
    >
      <Menu.Item
        onClick={() => signOut()}
        icon={<IconLogout size={16} />}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
};

export default memo(AdminMenu);
