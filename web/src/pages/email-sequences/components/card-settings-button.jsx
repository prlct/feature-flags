import React, { forwardRef } from 'react';
import { UnstyledButton } from '@mantine/core';
import { IconDots } from '@tabler/icons';

const CardSettingsButton = forwardRef((props, ref) => (
  <UnstyledButton ref={ref} {...props}>
    <IconDots size={20} p={2} color="gray" />
  </UnstyledButton>
));

export default React.memo(CardSettingsButton);
