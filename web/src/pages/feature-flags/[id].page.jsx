import { useCallback, useEffect } from 'react';
import Head from 'next/head';
import {
  Loader,
  Stack,
  Tabs,
  Breadcrumbs,
  Group,
  Switch,
  Text,
} from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';

import { featureFlagApi } from 'resources/feature-flag';
import { Link } from 'components';
import * as routes from 'routes';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';
import { handleError } from 'helpers';

import { useRouter } from 'next/router';
import Settings from './components/settings';
import History from './components/history';

const FeatureFlag = () => {
  const router = useRouter();
  const [env] = useLocalStorage({
    key: LOCAL_STORAGE_ENV_KEY,
    defaultValue: ENV.DEVELOPMENT,
    getInitialValueInEffect: false,
  });

  const tab = router.asPath.split('#')?.[1] || 'settings';
  const matches = useMediaQuery('(max-width: 768px)');

  const { id } = router.query;

  const { data: feature, refetch, isIdle } = featureFlagApi.useGetById({ _id: id, env });

  useEffect(() => {
    if (!isIdle) {
      refetch();
    }
  }, [env, refetch, isIdle]);

  const toggleFeatureStatusMutation = featureFlagApi.useToggleFeatureStatusOnSettingsPage();

  const handleSwitchChange = useCallback(() => {
    const reqData = {
      _id: feature._id,
      env: feature.env,
    };

    return toggleFeatureStatusMutation.mutate(reqData, {
      onSuccess: ({ enabled }) => {
        showNotification({
          title: 'Success',
          message: `The feature was successfully ${enabled ? 'enabled' : 'disabled'}`,
          color: 'green',
        });
      },
      onError: (e) => handleError(e),
    });
  }, [feature?._id, feature?.env, toggleFeatureStatusMutation]);

  const breadcrumbItems = [
    { title: 'Feature flags', href: routes.route.home },
    { title: feature?.name, href: '#' },
  ].map((item) => (
    <Link type="router" size="xl" href={item.href} key={item.title} underline={false}>
      {item.title}
    </Link>
  ));

  return (
    <>
      <Head>
        <title>{feature?.name}</title>
      </Head>

      {feature ? (
        <Stack spacing="sm">
          <Group pt={24}>
            <Breadcrumbs sx={{
              '& a': {
                color: 'black',
                fontSize: matches && 16,
                fontWeight: matches && 600,
              },
            }}
            >
              {breadcrumbItems}
            </Breadcrumbs>
            <Switch
              label={
                <Text span size={matches ? 16 : 'lg'} weight={600}>{`Feature ${feature?.enabled ? 'enabled' : 'disabled'}`}</Text>
              }
              styles={{ body: { alignItems: 'center' } }}
              sx={{ label: { cursor: 'pointer' } }}
              checked={feature.enabled}
              onChange={handleSwitchChange}
            />
          </Group>

          <Tabs
            defaultValue="settings"
            value={tab}
            onTabChange={(value) => router.push(`#${value}`)}
            keepMounted={false}
          >
            <Tabs.List>
              <Tabs.Tab value="settings">
                Settings
              </Tabs.Tab>
              <Tabs.Tab value="history">
                History
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="settings">
              <Settings feature={feature} env={env} />
            </Tabs.Panel>
            <Tabs.Panel value="history">
              <History featureId={feature._id} env={env} />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default FeatureFlag;
