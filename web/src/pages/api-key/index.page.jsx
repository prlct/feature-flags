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
import { useMediaQuery } from '@mantine/hooks';
import { IconCopy, IconCheck, IconEye, IconEyeOff } from '@tabler/icons';
import { applicationApi } from 'resources/application';

const ApiKey = () => {
  const [isPublicKeyCopied, setIsPublicKeyCopied] = useState(false);
  const [isPrivateKeyCopied, setIsPrivateKeyCopied] = useState(false);
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false);
  const { data, isLoading } = applicationApi.useGetApplication();

  const matches = useMediaQuery('(max-width: 768px)');

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
          <Title
            order={matches ? 4 : 2}
            sx={{ paddingTop: matches && 24 }}
          >
            API keys
          </Title>
          <TextInput
            sx={(theme) => ({
              width: 560,
              '& input': {
                border: `1px solid ${theme.colors.gray[2]}`,
              },
              '@media (max-width: 768px)': {
                width: '100%',
                '& input': {
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                '& svg': {
                  strokeWidth: 1,
                },
              },
            })}
            label={<Title order={matches ? 6 : 4}>Publishable API key</Title>}
            value={data?.publicApiKey}
            rightSection={(
              <Tooltip label={isPublicKeyCopied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={isPublicKeyCopied ? 'teal' : 'gray'} onClick={handlePublicKeyCopy}>
                  {isPublicKeyCopied
                    ? <IconCheck size={matches ? 24 : 16} />
                    : <IconCopy size={matches ? 24 : 16} />}
                </ActionIcon>
              </Tooltip>
            )}
            onChange={() => {}}
          />

          <TextInput
            sx={(theme) => ({
              width: 560,
              '& input': {
                border: `1px solid ${theme.colors.gray[2]}`,
              },
              '@media (max-width: 768px)': {
                width: '100%',
                '& input': {
                  paddingRight: 62,
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                '& .mantine-Input-rightSection': {
                  justifyContent: 'flex-end',
                  paddingRight: 4,
                  '& svg': {
                    strokeWidth: 1,
                  },
                },
              },
            })}
            label={<Title order={matches ? 6 : 4}>Private API key</Title>}
            value={isPrivateKeyVisible ? data?.privateApiKey : '*******************************************************'}
            rightSectionWidth={80}
            rightSection={(
              <Group spacing={3}>
                <Tooltip label={isPrivateKeyVisible ? 'Hide' : 'Show'} withArrow position="right">
                  <ActionIcon onClick={handlePrivateKeyVisible}>
                    {isPrivateKeyVisible
                      ? <IconEyeOff size={matches ? 24 : 16} />
                      : <IconEye size={matches ? 24 : 16} />}
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={isPrivateKeyCopied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon color={isPrivateKeyCopied ? 'teal' : 'gray'} onClick={handlePrivateKeyCopy}>
                    {isPrivateKeyCopied
                      ? <IconCheck size={matches ? 24 : 16} />
                      : <IconCopy size={matches ? 24 : 16} />}
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
            onChange={() => {}}
          />
        </Stack>

      )}
    </>
  );
};

export default ApiKey;
