import { memo } from 'react';
import {
  Header as LayoutHeader,
  Group,
} from '@mantine/core';

import { useGrowthFlags } from 'contexts/growth-flags-context';
import { statisticsApi } from 'resources/statistics';

import AdminMenu from './components/AdminMenu';
import EnvSelect from './components/EnvSelect';
import CallToActionBanner from './components/CallToActionBanner';

import { useStyles } from './styles';

const Header = () => {
  const growthFlags = useGrowthFlags();

  const isSubscriptionsOn = growthFlags && growthFlags.isOn('subscriptions');
  const { data: statistics } = statisticsApi.useGetStatistics(!!isSubscriptionsOn);

  const { classes } = useStyles();

  return (
    <>
      <LayoutHeader
        component="header"
        height={72}
        p="sm"
        className={classes.main}
      >
        <Group spacing="lg" sx={{ marginLeft: 'auto' }} className={classes.menu}>
          <EnvSelect />
          <AdminMenu />
        </Group>
      </LayoutHeader>
      {statistics?.limitReached && <CallToActionBanner />}
    </>
  );
};

export default memo(Header);
