import { forwardRef, memo } from 'react';
import { adminApi } from 'resources/admin';
import { Avatar, UnstyledButton } from '@mantine/core';

const MenuToggle = forwardRef((props, ref) => {
  const { data: admin } = adminApi.useGetCurrent();

  return (
    <UnstyledButton ref={ref} {...props}>
      <Avatar color="gray" radius="xl">
        {/* {admin.firstName?.charAt(0)} */}
        {/* {admin.lastName?.charAt(0)} */}
      </Avatar>
    </UnstyledButton>
  );
});

export default memo(MenuToggle);
