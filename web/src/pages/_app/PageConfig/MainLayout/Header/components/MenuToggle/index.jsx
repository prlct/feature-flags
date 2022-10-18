import { forwardRef, memo } from 'react';
import { Avatar, UnstyledButton } from '@mantine/core';

const MenuToggle = forwardRef((props, ref) => (
  <UnstyledButton ref={ref} {...props}>
    <Avatar color="gray" radius="xl" />
  </UnstyledButton>
));

export default memo(MenuToggle);
