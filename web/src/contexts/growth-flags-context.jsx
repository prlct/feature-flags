import { createContext, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import GrowthFlags from '@growthflags/js-sdk';

import { adminApi } from 'resources/admin';

export const growthFlags = GrowthFlags.create({
  env: process.env.NEXT_PUBLIC_APP_ENV,
  publicApiKey: process.env.NEXT_PUBLIC_GROWTHFLAGS_PUBLIC_KEY,
});

const GrowthFlagsContext = createContext(null);

export const GrowthFlagsContextProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: currentAdmin } = adminApi.useGetCurrent();

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      if (!currentAdmin) return;
      await growthFlags.fetchFeatureFlags({
        id: currentAdmin._id,
        data: { email: currentAdmin.email },
      });
      setIsLoaded(true);
    };
    fetchFeatureFlags();
  }, [currentAdmin]);

  return (
    <GrowthFlagsContext.Provider value={isLoaded ? growthFlags : null}>
      {children}
    </GrowthFlagsContext.Provider>
  );
};

GrowthFlagsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useGrowthFlags = () => useContext(GrowthFlagsContext);
