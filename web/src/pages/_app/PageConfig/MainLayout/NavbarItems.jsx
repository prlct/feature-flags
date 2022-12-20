import PropTypes from 'prop-types';
import { ActionIcon, Group, Text } from '@mantine/core';

import { Link } from 'components';
import * as routes from 'routes';

import router from 'next/router';

import { useStyles } from './styles';

const configurations = Object.values(routes.configuration);

const NavbarItems = ({ navbarTabs, menuOpen }) => {
  const { classes } = useStyles();

  return (
    <Group
      pl={16}
      direction="column"
      position="left"
    >
      {navbarTabs.map((tab) => {
        const isTabActive = configurations.find(
          (item) => item.route === router.route && item.navbarTab === tab.label,
        );

        if (tab.component) {
          return (
            <tab.component
              key={tab.path}
              tab={tab}
              isTabActive={!!isTabActive}
              menuOpen={menuOpen}
            />
          );
        }

        return (
          <Link
            key={tab.label}
            href={tab.path}
            underline={false}
            type="router"
            style={{ width: '100%' }}
          >
            <Group
              direction="row"
              className={[
                classes.tabItem,
                isTabActive && classes.activeTab,
              ]}
              onClick={menuOpen}
            >
              <ActionIcon
                radius="md"
                variant="transparent"
                size={40}
                className={[
                  classes.tabIcon,
                  isTabActive && classes.activeIcon,
                ]}
              >
                {tab.icon}
              </ActionIcon>

              <Text className={[
                classes.label,
                isTabActive && classes.activeLabel,
              ]}
              >
                {tab.label}
              </Text>
            </Group>
          </Link>
        );
      })}
    </Group>
  );
};

NavbarItems.propTypes = {
  navbarTabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  menuOpen: PropTypes.func,
};

NavbarItems.defaultProps = {
  menuOpen: null,
};

export default NavbarItems;
