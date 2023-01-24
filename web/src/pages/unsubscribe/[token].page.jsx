import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useGetUnsubscribeTokenInfo, useUnsubscribe } from 'resources/email-sequence/email-sequence.api';
import { Box, Button, Card, Group, Loader, Text } from '@mantine/core';

const Unsubscribe = () => {
  const router = useRouter();
  const [cancelled, setCancelled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [unsubscribed, setIsUnsubscribed] = useState(false);

  const { token } = router.query;

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router]);

  const { data: tokenInfo } = useGetUnsubscribeTokenInfo(token);
  const unsubscribe = useUnsubscribe(token).mutate;

  const handleUnsub = async () => {
    await unsubscribe();
    setIsUnsubscribed(true);
  };

  if (!tokenInfo || !isReady) {
    return <Loader />;
  }

  if (unsubscribed) {
    return (
      <Box sx={{ display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center' }}>
        <Card shadow="sm" withBorder sx={{ width: 600 }}>
          <Card.Section p={12}>
            <Text weight="bold">
              {`Successfully unsubscribed from ${tokenInfo.companyName}`}
            </Text>
          </Card.Section>
        </Card>
      </Box>
    );
  }

  if (cancelled) {
    return (
      <Box sx={{ display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center' }}>
        <Card shadow="sm" withBorder sx={{ width: 600 }}>
          <Card.Section p={12}>
            <Text weight="bold">
              You can just leave the page
            </Text>
          </Card.Section>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center' }}>
      <Card shadow="sm" withBorder sx={{ width: 600 }}>
        <Card.Section p={12}>
          <Text weight="bold">
            Are you sure you want to unsubscribe?
          </Text>
          <Text>
            You are currently subscribed to
            {tokenInfo.companyName}
            {' '}
            with the following address:
            {tokenInfo.targetEmail}
          </Text>
        </Card.Section>
        <Card.Section p={12}>
          <Group position="apart">
            <Button variant="subtle" sx={{ width: '40%' }} onClick={() => handleUnsub()}>Yes</Button>
            <Button sx={{ width: '40%' }} onClick={() => setCancelled(true)}>No</Button>
          </Group>
        </Card.Section>
      </Card>

    </Box>
  );
};

export default Unsubscribe;
