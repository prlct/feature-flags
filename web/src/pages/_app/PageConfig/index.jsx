import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import * as routes from 'routes';
import { Global } from '@mantine/core';
import { adminApi } from 'resources/admin';

import 'resources/admin/admin.handlers';
import { globalStyles } from 'theme/globalStyles';

import MainLayout from './MainLayout';
import UnauthorizedLayout from './UnauthorizedLayout';
import PrivateScope from './PrivateScope';

const configurations = Object.values(routes.configuration);

const layoutToComponent = {
  [routes.layout.MAIN]: MainLayout,
  [routes.layout.UNAUTHORIZED]: UnauthorizedLayout,
  [routes.layout.NONE]: ({ children }) => children,
};

const scopeToComponent = {
  [routes.scope.PRIVATE]: PrivateScope,
  [routes.scope.PUBLIC]: ({ children }) => children,
  [routes.scope.NONE]: ({ children }) => children,
};

const PageConfig = ({ children }) => {
  const router = useRouter();
  const { data: currentAdmin, isLoading: isCurrentAdminLoading } = adminApi.useGetCurrent();

  if (isCurrentAdminLoading) return null;

  const page = configurations.find((r) => r.route === router.route);
  const Layout = layoutToComponent[page.layout];
  const Scope = scopeToComponent[page.scope];

  if (page.scope === routes.scope.PRIVATE && !currentAdmin) {
    router.push(routes.route.signIn);
    return null;
  }

  if (page.scope === routes.scope.PUBLIC && currentAdmin) {
    router.push(routes.route.home);
    return null;
  }

  return (
    <Scope>
      <Global styles={globalStyles} />
      <Layout>
        {children}
      </Layout>
    </Scope>
  );
};

PageConfig.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageConfig;
