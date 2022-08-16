import { useCallback, useState } from 'react';
import Head from 'next/head';
import {
  Title,
  Stack,
  Loader,
  TextInput,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons';
import { accountApi } from 'resources/account';

const ApiKey = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { data, isLoading } = accountApi.useGetAccount();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(data?.apiKey);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, []);

  return (
    <>
      <Head>
        <title>API Key</title>
      </Head>
      {isLoading ? <Loader /> : (
        <Stack spacing="lg">
          <Title order={2}>API key</Title>
          <TextInput
            sx={{ width: 400 }}
            label="Publishable API key"
            value={data?.apiKey}
            disabled
            rightSection={
              <Tooltip label={isCopied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={isCopied ? 'teal' : 'gray'} onClick={handleCopy}>
                  {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            }
          />
        </Stack>
      )}
    </>
  );
};

export default ApiKey;
