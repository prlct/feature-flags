import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useGetUnsubscribeTokenInfo, useUnsubscribe } from 'resources/email-sequence/email-sequence.api';
import { Box, Button, Card, Group, LoadingOverlay, Text } from '@mantine/core';
import { IconCheck, IconMail, IconRocket } from '@tabler/icons';

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

  const { data: tokenInfo, isLoading } = useGetUnsubscribeTokenInfo(token);
  const unsubscribe = useUnsubscribe(token).mutate;

  const handleUnsub = async () => {
    await unsubscribe();
    setIsUnsubscribed(true);
  };

  if (isLoading || !isReady) {
    return <LoadingOverlay visible />;
  }

  if (unsubscribed) {
    return (
      <Box sx={{ display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center' }}>
        <Card shadow="sm" withBorder sx={{ width: 600 }}>
          <Card.Section pt={40}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 52,
                height: 52,
                backgroundColor: '#F5F5F5',
                borderRadius: '12px',
              }}
              >
                <IconCheck />
              </Box>
            </Box>
          </Card.Section>
          <Card.Section p={40}>
            <Text weight="bold" align="center">
              You have successfully unsubscribed
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
          <Card.Section pt={40}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 52,
                height: 52,
                backgroundColor: '#F5F5F5',
                borderRadius: '12px',
              }}
              >
                <IconRocket />
              </Box>
            </Box>
          </Card.Section>
          <Card.Section px={40}>
            <Text align="center" weight="bold">Thanks for keeping the subscription!</Text>
          </Card.Section>
          <Card.Section p={40}>
            <Text align="center">
              We won’t send you many emails.
              We promise 🤓
              <br />
              However, you can unsubscribe at any time.
              <br />
              Have a nice day!
            </Text>
          </Card.Section>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center' }}>
      <Card shadow="sm" withBorder sx={{ width: 600 }}>
        <Card.Section pt={40}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              backgroundColor: '#F5F5F5',
              borderRadius: '12px',
            }}
            >
              <IconMail />
            </Box>
          </Box>
        </Card.Section>
        <Card.Section px={40}>
          <Text weight="bold" sx={{ textAlign: 'center' }}>
            Are you sure you want to unsubscribe?
          </Text>
          <Text align="center">
            You are currently subscribed to&nbsp;
            <Text component="span" weight="bold">{tokenInfo?.companyName}</Text>
            &nbsp;with the following address:&nbsp;
            <Text component="span" weight="bold">{tokenInfo?.targetEmail}</Text>
          </Text>
        </Card.Section>
        <Card.Section p={40}>
          <Group position="apart">
            <Button variant="subtle" sx={{ width: '40%', backgroundColor: 'rgba(115, 74, 183, 0.1)' }} onClick={() => handleUnsub()}>Yes, unsubscribe</Button>
            <Button sx={{ width: '40%' }} onClick={() => setCancelled(true)}>No, keep subscription</Button>
          </Group>
        </Card.Section>
      </Card>

    </Box>
  );
};

export default Unsubscribe;
