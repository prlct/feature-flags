import { useCallback, useEffect, useState } from 'react';

import { Box, Button, Stack, Loader, LoadingOverlay, Text } from '@mantine/core';
import { useGrowthFlags } from 'contexts/growth-flags-context';

const SequencesDemo = () => {
  const gf = useGrowthFlags();
  const [isLoading, setIsLoading] = useState(false);

  const demoConfig = gf?.getConfig('sequences-demo');
  const pageViewEvent = demoConfig?.pageEvent || 'demo-view-event';
  const demoEventKey = demoConfig?.eventKey || 'sequences-demo';
  const demoButtonText = demoConfig?.buttonText || 'Send me details';

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
    <Box sx={{
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '579px',
      height: '528px',
      '@media (max-width: 768px)': {
        width: '80%',
        height: '50%',
        fontSize: 14,
        marginTop: 24,
      },
    }}
    >
      <Stack sx={{ backgroundColor: '#734AB70D', borderRadius: '20px', padding: 80 }}>
        <Text sx={{ fontSize: 40, textAlign: 'center' }}>
          👋🏻
        </Text>
        <Text align="center" size="lg">
          Hey,
          <br />
          here will be our most valuable&nbsp;
          <strong>killer feature,</strong>
          <br />
          don’t miss it!
        </Text>
        <Text size="lg" align="center">
          P.S. Click the button and we’ll send you detailed information!
        </Text>
        <Button
          onClick={() => triggerDemoEvent(demoEventKey)}
          disabled={isLoading}
          sx={{ width: '209px', margin: '0 auto' }}
        >
          {demoButtonText}
        </Button>
      </Stack>
      {isLoading && <Loader />}
    </Box>
  );
};

export default SequencesDemo;
