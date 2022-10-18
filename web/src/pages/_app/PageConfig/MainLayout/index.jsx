import PropTypes from 'prop-types';
import { AppShell } from '@mantine/core';

import Header from './Header';

const MainLayout = ({ children }) => (
  <AppShell
    header={<Header />}
    // footer={<Footer />}
    fixed
    padding={32}
    styles={(theme) => ({
      root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.colors.gray[0],
      },
    })}
  >
    {children}
  </AppShell>
);

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
