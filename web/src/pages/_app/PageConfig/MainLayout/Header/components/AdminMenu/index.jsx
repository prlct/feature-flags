import { memo, useCallback } from 'react';
import { accountApi } from 'resources/account';
import { Menu, Text } from '@mantine/core';
import { IconLogout } from '@tabler/icons';

import { useAmplitude } from 'contexts/amplitude-context';

import { adminApi } from 'resources/admin';

import MenuToggle from '../MenuToggle';

const AdminMenu = () => {
  const { mutate: signOut } = accountApi.useSignOut();
  const { data: currentAdmin } = adminApi.useGetCurrent();

  const amplitude = useAmplitude();

  const onClickSignOut = useCallback(() => {
    amplitude.track('Admin log out');
    signOut();
  }, [amplitude, signOut]);

  const receiveAdminName = useCallback(() => {
    if (currentAdmin) {
      if (currentAdmin.lastName) {
        return `${currentAdmin.firstName} ${currentAdmin.lastName}`;
      }
      return currentAdmin.firstName;
    }

    return 'Admin';
  }, [currentAdmin]);

  return (
    <Menu>
      <Text
        size={14}
        weight={600}
        color="gray"
        ml={16}
        style={{ letterSpacing: '0.4' }}
      >
        {receiveAdminName()}
      </Text>
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
