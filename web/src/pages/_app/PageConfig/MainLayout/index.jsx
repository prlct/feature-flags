import PropTypes from 'prop-types';
import {
  AppShell,
  Container,
  Group,
  Navbar,
  Burger,
  Accordion,
  MediaQuery,
  ActionIcon,
  Text,
  Stack,
  UnstyledButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconFlag, IconFilter, IconApiApp, IconUsers, IconLogout } from '@tabler/icons';

import { PriceIcon } from 'public/icons';

import { Link } from 'components';

import { useGrowthFlags } from 'contexts/growth-flags-context';
import * as routes from 'routes';

import { LogoDarkImage, LogoImage } from 'public/images';
import { useState, useCallback } from 'react';
import { accountApi } from 'resources/account';
import { useAmplitude } from 'contexts/amplitude-context';
import Header from './Header';

import { useStyles } from './styles';
import PipelinesNavbarItem from './PipelinesNavbarItem';
import DemoNavbarItem from './DemoNavbarItem';
import NavbarItems from './NavbarItems';
import EnvSelect from './Header/components/EnvSelect';

const ASIDE_WIDTH = 255;

const navbarTabs = [{
  label: routes.navbarTabs.FEATURE_FLAGS,
  path: routes.route.home,
  icon: <IconFlag />,
},
{
  label: routes.navbarTabs.ACTIVATION_PIPELINES,
  path: routes.route.emailSequences,
  icon: <IconFilter />,
  component: PipelinesNavbarItem,
  featureFlag: 'email-sequences',
},
{
  label: routes.navbarTabs.API_KEYS,
  path: routes.route.apiKey,
  icon: <IconApiApp />,
},
{
  label: routes.navbarTabs.TEAM_MEMBERS,
  path: routes.route.members,
  icon: <IconUsers />,
},
{
  label: routes.navbarTabs.PRICING,
  path: routes.route.subscriptionPlans,
  icon: <PriceIcon />,
},
{
  label: 'Sequences demo',
  path: routes.route.sequencesDemo,
  icon: <IconFlag />,
  featureFlag: 'sequences-demo',
  component: DemoNavbarItem,
},
];

const MainLayout = ({ children }) => {
  const growthflags = useGrowthFlags();

  const { classes } = useStyles();
  const matches = useMediaQuery('(max-width: 768px)');

  const [menuOpen, setMenuOpen] = useState(false);

  const navbarTabsFiltered = navbarTabs.filter((tab) => !tab.featureFlag
    || (tab.featureFlag && growthflags?.isOn(tab.featureFlag)));

  const handleMenuOpen = (value) => {
    setMenuOpen(value);
  };

  const { mutate: signOut } = accountApi.useSignOut();

  const amplitude = useAmplitude();

  const onClickSignOut = useCallback(() => {
    amplitude.track('Admin log out');
    signOut();
  }, [amplitude, signOut]);

  const copyright = (
    <Stack mt="auto" mb={16} spacing={0} pl={24}>
      <Text size={10}>Growthflags @ 2023</Text>
      <Text size={10}>Paralect’s product</Text>
      <UnstyledButton component="a" href="https://growthflags.com/terms">
        <Text size={10} underline>Terms of Use</Text>
      </UnstyledButton>
      <UnstyledButton component="a" href="https://growthflags.com/privacy-policy">
        <Text size={10} underline>Privacy Policy</Text>
      </UnstyledButton>
    </Stack>
  );

  return (
    <AppShell
      header={<Header />}
      navbar={(
        <Navbar
          p={0}
          hiddenBreakpoint="sm"
          width={{ sm: ASIDE_WIDTH, lg: ASIDE_WIDTH }}
          position={{ top: 0, left: 0 }}
          sx={{
            height: '100vh',
            top: 0,
            '@media (max-width: 768px)': {
              height: '72px',
            },
          }}
        >
          {matches ? (
            <>
              <MediaQuery
                query="(max-width: 768px)"
                styles={{ marginBottom: 16, '& svg': { width: !menuOpen && 29 } }}
              >
                <Group
                  spacing={36}
                  className={classes.logoGroup}
                  sx={{ marginTop: menuOpen && 33 }}
                >
                  <Link type="router" href={routes.route.home} underline={false}>
                    {menuOpen ? (
                      <LogoDarkImage />
                    ) : (
                      <LogoImage sx={{ width: 30 }} />
                    )}
                  </Link>
                  {!menuOpen && (
                    <EnvSelect />
                  )}
                </Group>
              </MediaQuery>
              <Accordion
                value={menuOpen}
                onChange={handleMenuOpen}
                chevron={(
                  <Burger
                    size={16}
                    opened={menuOpen}
                    onClick={() => setMenuOpen((o) => !o)}
                  />
            )}
                variant="filled"
                styles={{
                  chevron: {
                    position: 'absolute',
                    left: 'auto',
                    right: 32,
                    top: 30,
                  },
                  item: { backgroundColor: '#ffff !important', height: menuOpen && '100vh' },
                  control: { padding: 0, color: '#424242' },
                  content: { paddingTop: 25 },
                }}
              >
                <Accordion.Item value="menu">
                  <Accordion.Control />
                  <Accordion.Panel>
                    <NavbarItems
                      navbarTabs={navbarTabsFiltered}
                      menuOpen={() => handleMenuOpen(false)}
                    />
                    <Group
                      direction="row"
                      className={classes.logout}
                      onClick={onClickSignOut}
                    >
                      <ActionIcon
                        radius="md"
                        variant="transparent"
                        size={40}
                        className={classes.tabIcon}
                      >
                        <IconLogout size={24} />
                      </ActionIcon>
                      <Text>
                        Logout
                      </Text>
                    </Group>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </>
          ) : (
            <>
              <Group spacing={36} className={classes.logoGroup}>
                <Link type="router" href={routes.route.home} underline={false}>
                  <LogoDarkImage />
                </Link>
              </Group>
              <NavbarItems navbarTabs={navbarTabsFiltered} />
              {copyright}
            </>
          )}
        </Navbar>
      )}
      padding={0}
      styles={(theme) => ({
        root: {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.white,
        },
        main: {
          width: '99vw',
          minHeight: 'auto',
        },
      })}
    >
      <Container fluid="true" size="xl" className={classes.container}>
        {children}
      </Container>
    </AppShell>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
