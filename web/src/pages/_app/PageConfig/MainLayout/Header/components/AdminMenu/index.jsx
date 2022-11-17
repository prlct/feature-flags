import { memo, useCallback } from 'react';
import { accountApi } from 'resources/account';
import { Menu } from '@mantine/core';
import { IconLogout } from '@tabler/icons';

import { useAmplitude } from 'contexts/amplitude-context';

import MenuToggle from '../MenuToggle';

const AdminMenu = () => {
  const { mutate: signOut } = accountApi.useSignOut();

  const amplitude = useAmplitude();

  const onClickSignOut = useCallback(() => {
    amplitude.track('Admin log out');
    signOut();
  }, [amplitude, signOut]);

  return (
    <Menu>
      <Menu.Target>
        <MenuToggle />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={onClickSignOut}
          icon={<IconLogout size={16} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default memo(AdminMenu);
