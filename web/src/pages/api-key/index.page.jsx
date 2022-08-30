import { useCallback, useState } from 'react';
import Head from 'next/head';
import {
  Title,
  Stack,
  Loader,
  TextInput,
  Group,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { IconCopy, IconCheck, IconEye, IconEyeOff } from '@tabler/icons';
import { applicationApi } from 'resources/application';

const ApiKey = () => {
  const [isPublicKeyCopied, setIsPublicKeyCopied] = useState(false);
  const [isPrivateKeyCopied, setIsPrivateKeyCopied] = useState(false);
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false);
  const { data, isLoading } = applicationApi.useGetApplication();

  const handlePublicKeyCopy = useCallback(() => {
    navigator.clipboard.writeText(data?.publicApiKey);
    setIsPublicKeyCopied(true);
    setTimeout(() => {
      setIsPublicKeyCopied(false);
    }, 2000);
  }, [data?.publicApiKey]);

  const handlePrivateKeyCopy = useCallback(() => {
    navigator.clipboard.writeText(data?.privateApiKey);
    setIsPrivateKeyCopied(true);
    setTimeout(() => {
      setIsPrivateKeyCopied(false);
    }, 2000);
  }, [data?.privateApiKey]);

  const handlePrivateKeyVisible = useCallback(() => {
    setIsPrivateKeyVisible(!isPrivateKeyVisible);
  }, [isPrivateKeyVisible]);

  return (
    <>
      <Head>
        <title>API keys</title>
      </Head>
      {isLoading ? <Loader /> : (
        <Stack spacing="lg">
          <Title order={2}>API keys</Title>
          <TextInput
            sx={{ width: 560 }}
            label={<Title order={4}>Publishable API key</Title>}
            value={data?.publicApiKey}
            rightSection={
              <Tooltip label={isPublicKeyCopied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={isPublicKeyCopied ? 'teal' : 'gray'} onClick={handlePublicKeyCopy}>
                  {isPublicKeyCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            }
            onChange={() => {}}
          />
          <TextInput
            sx={{ width: 560 }}
            label={<Title order={4}>Private API key</Title>}
            value={isPrivateKeyVisible ? data?.privateApiKey : '*******************************************************'}
            rightSectionWidth={80}
            rightSection={
              <Group>
                <Tooltip label={isPrivateKeyVisible ? 'Hide' : 'Show'} withArrow position="right">
                  <ActionIcon onClick={handlePrivateKeyVisible}>
                    {isPrivateKeyVisible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={isPrivateKeyCopied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={isPrivateKeyCopied ? 'teal' : 'gray'} onClick={handlePrivateKeyCopy}>
                    {isPrivateKeyCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              </Group>
            }
            onChange={() => {}}
          />
        </Stack>
      )}
    </>
  );
};

export default ApiKey;
