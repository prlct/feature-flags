import React, { forwardRef } from 'react';
import { UnstyledButton } from '@mantine/core';
import { IconTool } from '@tabler/icons';

const CardSettingsButton = forwardRef((props, ref) => (
  <UnstyledButton ref={ref} {...props}>
    <IconTool size={20} p={2} />
  </UnstyledButton>
));

export default React.memo(CardSettingsButton);
