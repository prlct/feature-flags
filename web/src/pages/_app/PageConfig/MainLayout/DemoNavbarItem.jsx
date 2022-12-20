import PropTypes from 'prop-types';

import { ActionIcon, Group, Text } from '@mantine/core';
import { Link } from 'components';
import { useGrowthFlags } from 'contexts/growth-flags-context';

import { useStyles } from './styles';

const DemoNavbarItem = ({ tab, isTabActive }) => {
  const classes = useStyles();
  const gf = useGrowthFlags();

  if (tab.featureFlag && !gf?.isOn(tab.featureFlag)) {
    return null;
  }

  let { label } = tab;

  if (tab.featureFlag) {
    label = gf?.getConfig(tab.featureFlag)?.label || tab.label;
  }

  return (
    <Link
      key={tab.label}
      href={tab.path}
      underline={false}
      type="router"
      style={{ width: '100%', color: '#424242' }}
    >
      <Group
        direction="row"
        className={[
          classes.tabItem,
          isTabActive && classes.activeTab,
        ]}
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
          {label}
        </Text>
      </Group>
    </Link>
  );
};

DemoNavbarItem.propTypes = {
  tab: PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.node,
    path: PropTypes.string,
    featureFlag: PropTypes.string,
  }).isRequired,
  isTabActive: PropTypes.bool.isRequired,
};

export default DemoNavbarItem;
