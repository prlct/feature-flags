import { memo, useCallback } from 'react';
import { accountApi } from 'resources/account';
import { Avatar, Menu, Stack, Text, Group } from '@mantine/core';
import { IconCheck, IconLogout } from '@tabler/icons';

import { useAmplitude } from 'contexts/amplitude-context';

import { adminApi } from 'resources/admin';

import MenuToggle from '../MenuToggle';

const AdminMenu = () => {
  const { mutate: signOut } = accountApi.useSignOut();
  const { data: currentAdmin } = adminApi.useGetCurrent();

  const amplitude = useAmplitude();

  const changeCurrentCompany = adminApi.useChangeCurrentCompany().mutate;

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

  const changeCompanyHandler = (companyId) => {
    if (companyId === currentAdmin.currentCompany._id) {
      return;
    }

    changeCurrentCompany(companyId);
  };

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
        {currentAdmin.companies.map((company) => (
          <Menu.Item key={company._id} icon={<Avatar color="gray" radius="xl" />} onClick={() => changeCompanyHandler(company._id)}>
            <Stack spacing="xs">
              <Group spacing={2}>
                <Text size="sm">{company.name}</Text>
                {company._id === currentAdmin.currentCompany._id && <IconCheck size={16} />}
              </Group>
              <Text size="xs" color="grey">{company._id === currentAdmin.ownCompanyId ? 'Owner' : 'Member'}</Text>
            </Stack>
          </Menu.Item>
        ))}
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
