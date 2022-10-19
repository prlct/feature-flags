import { memo } from 'react';
import { accountApi } from 'resources/account';
import { Menu } from '@mantine/core';
import { IconLogout } from '@tabler/icons';
import MenuToggle from '../MenuToggle';

const AdminMenu = () => {
  const { mutate: signOut } = accountApi.useSignOut();

  return (
    <Menu>
      <Menu.Target>
        <MenuToggle />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => signOut()}
          icon={<IconLogout size={16} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default memo(AdminMenu);
