import { useCallback, useEffect, useState } from 'react';

import { Box, Button, Group, Loader, LoadingOverlay, Text } from '@mantine/core';
import { useGrowthFlags } from 'contexts/growth-flags-context';

const SequencesDemo = () => {
  const gf = useGrowthFlags();
  const [isLoading, setIsLoading] = useState(false);

  const demoConfig = gf?.getConfig('sequences-demo');
  const pageViewEvent = demoConfig?.pageEvent || 'demo-view-event';
  const demoText = demoConfig?.text;
  const demoEventKey = demoConfig?.eventKey || 'sequences-demo';
  const demoButtonText = demoConfig?.buttonText || 'Demo button';

  const triggerDemoEvent = useCallback(async (eventKey) => {
    try {
      setIsLoading(true);
      await gf?.triggerEvent(eventKey);
    } finally {
      setIsLoading(false);
    }
  }, [gf]);

  useEffect(() => {
    if (gf) {
      triggerDemoEvent(pageViewEvent);
    }
  }, [gf, pageViewEvent, triggerDemoEvent]);

  if (!gf) {
    return <LoadingOverlay visible />;
  }

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
      <Button
        onClick={() => triggerDemoEvent(demoEventKey)}
        disabled={isLoading}
      >
        {demoButtonText}
      </Button>
      {isLoading && <Loader />}
    </Box>
  );
};

export default SequencesDemo;
