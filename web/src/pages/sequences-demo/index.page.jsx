import { Box, Button, Group, Loader, LoadingOverlay, Text } from '@mantine/core';
import { useGrowthFlags } from 'contexts/growth-flags-context';
import { useState } from 'react';

const SequencesDemo = () => {
  const gf = useGrowthFlags();
  const [isLoading, setIsLoading] = useState(false);

  if (!gf) {
    return <LoadingOverlay visible />;
  }

  const demoConfig = gf.getConfig('sequences-demo');
  const demoText = demoConfig?.text;
  const demoButtonText = demoConfig?.buttonText || 'Demo button';

  const triggerDemoEvent = async () => {
    try {
      setIsLoading(true);
      await gf.triggerEvent('sequences-demo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Group>
        <Text weight="bold">
          Demo text:
        </Text>
        <Text weight>
          {demoText}
        </Text>
      </Group>
      <Button onClick={triggerDemoEvent} disabled={isLoading}>{demoButtonText}</Button>
      {isLoading && <Loader />}
    </Box>
  );
};

export default SequencesDemo;
