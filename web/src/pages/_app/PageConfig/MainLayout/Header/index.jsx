import PropTypes from 'prop-types';
import { memo } from 'react';
import {
  Header as LayoutHeader,
  Group,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { useGrowthFlags } from 'contexts/growth-flags-context';
import { statisticsApi } from 'resources/statistics';

import AdminMenu from './components/AdminMenu';
import EnvSelect from './components/EnvSelect';
import CallToActionBanner from './components/CallToActionBanner';

import { useStyles } from './styles';

const Header = ({ menu }) => {
  const growthFlags = useGrowthFlags();

  const isSubscriptionsOn = growthFlags && growthFlags.isOn('subscriptions');
  const { data: statistics } = statisticsApi.useGetStatistics(!!isSubscriptionsOn);

  const { classes } = useStyles();
  const matches = useMediaQuery('(min-width: 768px)');

  return (
    <>
      <LayoutHeader
        component="header"
        height={72}
        p="sm"
        className={classes.main}
      >
        <Group spacing="lg" sx={{ marginLeft: matches ? 'auto' : 86 }} className={classes.menu}>

          {menu && (
            <EnvSelect />
          )}
          {matches && (
            <AdminMenu />
          )}
        </Group>
      </LayoutHeader>
      {statistics?.limitReached && <CallToActionBanner />}
    </>
  );
};

Header.propTypes = {
  menu: PropTypes.bool,
};

Header.defaultProps = {
  menu: false,
};

export default memo(Header);
