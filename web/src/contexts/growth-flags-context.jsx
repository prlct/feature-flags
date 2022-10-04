import { createContext, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from 'react-query';
import GrowthFlags from '@growthflags/js-sdk';

export const growthFlags = GrowthFlags.create({
  env: process.env.NEXT_PUBLIC_APP_ENV,
  publicApiKey: process.env.NEXT_PUBLIC_GROWTHFLAGS_PUBLIC_KEY,
});

const GrowthFlagsContext = createContext(null);

export const GrowthFlagsContextProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [isLoaded, setIsLoaded] = useState(false);

  const currentAdmin = queryClient.getQueryData(['currentAdmin']);

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
