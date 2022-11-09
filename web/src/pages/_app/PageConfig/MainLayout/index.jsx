import PropTypes from 'prop-types';

import { Affix, AppShell, Container, Group, Stack, Tooltip, UnstyledButton, Paper } from '@mantine/core';
import { IconBadges, IconFlag } from '@tabler/icons';
import { Link } from 'components';

import { useGrowthFlags } from 'contexts/growth-flags-context';
import * as routes from 'routes';

import Header from './Header';

const MainLayout = ({ children }) => {
  const growthflags = useGrowthFlags();
  const sideBarIsOn = growthflags?.isOn('email-sequences');

  return (
    <AppShell
      header={<Header />}
    // footer={<Footer />}
      fixed
      padding={0}
      styles={(theme) => ({
        root: {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      <>
        {sideBarIsOn && (
        <Group align="flex-start" sx={{ flexWrap: 'nowrap' }}>
          <Affix position={{ top: 72, left: 0 }}>
            <Paper withBorder>
              <Stack sx={{ width: 48, height: 'calc(100vh - 72px)', backgroundColor: 'white', paddingTop: 48 }} align="center">
                <Tooltip label="Feature flags">
                  <UnstyledButton>
                    <Link type="router" href={routes.route.home} underline={false}>
                      <IconFlag size={32} color="rgb(115, 74, 183)" />
                    </Link>
                  </UnstyledButton>
                </Tooltip>
                <Tooltip label="Email sequences">
                  <UnstyledButton>
                    <Link type="router" href={routes.route.emailSequences} underline={false}>
                      <IconBadges size={32} color="rgb(115, 74, 183)" />
                    </Link>
                  </UnstyledButton>
                </Tooltip>
              </Stack>
            </Paper>
          </Affix>

          <Container fluid size="xl" m="0 0 0 48px" sx={{ flexGrow: 1 }}>
            {children}
          </Container>
        </Group>
        )}
        {!sideBarIsOn && children}
      </>
    </AppShell>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
