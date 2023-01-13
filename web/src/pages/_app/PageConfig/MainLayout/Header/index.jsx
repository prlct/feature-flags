import { memo, useCallback, useEffect, useState } from 'react';
import {
  Header as LayoutHeader,
  Group,
  Stack,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { statisticsApi } from 'resources/statistics';
import queryClient from 'query-client';

import AdminMenu from './components/AdminMenu';
import EnvSelect from './components/EnvSelect';
import CallToActionBanner from './components/CallToActionBanner';

import { useStyles } from './styles';

const Header = () => {
  const admin = queryClient.getQueryData(['currentAdmin']);
  const companyId = admin.companyIds[0];

  const { data: mauStatistics } = statisticsApi.useGetStatistics();
  const { data: emailsStatistics } = statisticsApi.useGetEmailStatistics({ companyId });

  const [isMauLimit, setIsMauLimit] = useState(false);
  const [isEmailsLimit, setIsEmailsLimit] = useState(false);

  useEffect(() => {
    if (mauStatistics && mauStatistics?.usagePercentage >= 90) {
      setIsMauLimit(true);
    }
    if (emailsStatistics && emailsStatistics?.usagePercentage >= 100) {
      setIsEmailsLimit(true);
    }
  }, [emailsStatistics, mauStatistics]);

  const handleCloseAlert = useCallback((type) => {
    if (type === 'email') {
      setIsEmailsLimit(false);
    }
    if (type === 'mau') {
      setIsMauLimit(false);
    }
  }, []);

  const { classes } = useStyles();
  const matches = useMediaQuery('(min-width: 768px)');

  return (
    <LayoutHeader
      component="header"
      p="sm"
      className={classes.main}
    >
      <Stack sx={{ marginLeft: matches ? 'auto' : 0, width: matches && 'calc(100% - 254px)' }}>
        <Group spacing="lg" sx={{ marginLeft: matches ? 'auto' : 0 }} className={classes.menu}>
          {matches && (
            <>
              <EnvSelect />
              <AdminMenu />
            </>

          )}

        </Group>
        {isMauLimit
          && (
          <CallToActionBanner
            limitType="mau"
            currentPlan={mauStatistics?.currentPlan}
            usagePercentage={mauStatistics?.usagePercentage}
            handleClose={handleCloseAlert}
          />
          )}
        {isEmailsLimit
          && (
          <CallToActionBanner
            limitType="email"
            currentPlan={mauStatistics?.currentPlan}
            limit={emailsStatistics?.dailyEmailsLimit}
            handleClose={handleCloseAlert}
          />
          )}
      </Stack>

    </LayoutHeader>
  );
};

export default memo(Header);
