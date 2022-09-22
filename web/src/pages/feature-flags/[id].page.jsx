import { useEffect } from 'react';
import Head from 'next/head';
import {
  Loader,
  Stack,
  Tabs,
  Breadcrumbs,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import { featureFlagApi } from 'resources/feature-flag';
import { Link } from 'components';
import * as routes from 'routes';
import { ENV, LOCAL_STORAGE_ENV_KEY } from 'helpers/constants';
import { useGrowthFlags } from 'contexts/growth-flags-context';

import { useRouter } from 'next/router';
import Settings from './components/settings';
import ABTesting from './components/ab-testing';

const FeatureFlag = () => {
  const router = useRouter();
  const [env] = useLocalStorage({ key: LOCAL_STORAGE_ENV_KEY, defaultValue: ENV.DEVELOPMENT });
  const growthFlags = useGrowthFlags();

  const { id } = router.query;

  const { data: feature, refetch, isIdle } = featureFlagApi.useGetById({ _id: id, env });

  useEffect(() => {
    if (!isIdle) {
      refetch();
    }
  }, [env, refetch, isIdle]);

  const breadcrumbItems = [
    { title: 'Feature flags', href: routes.route.home },
    { title: feature?.name, href: '#' },
  ].map((item, index) => (
    <Link type="router" size="xl" href={item.href} key={index} underline={false}>
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
          <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>

          {/* TODO: Connect tabs with url */}
          <Tabs>
            <Tabs.Tab label="Settings">
              <Settings featureId={id} env={env} />
            </Tabs.Tab>

            {growthFlags && growthFlags.isOn('abTesting') && (
            <Tabs.Tab label="A/B testing">
              <ABTesting featureId={id} env={env} />
            </Tabs.Tab>
            )}
          </Tabs>
        </Stack>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default FeatureFlag;
