import { createContext, useContext, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import * as Amplitude from '@amplitude/analytics-browser';

import { adminApi } from 'resources/admin';

const { publicRuntimeConfig } = getConfig();

const AmplitudeContext = createContext(null);

export const AmplitudeContextProvider = ({ children }) => {
  const router = useRouter();
  const ref = useRef(false);
  const [amplitude, setAmplitude] = useState(null);

  const { data: currentAdmin } = adminApi.useGetCurrent();

  useEffect(() => {
    const init = async () => {
      if (router.isReady && !ref.current && currentAdmin?._id && process.env.NEXT_PUBLIC_APP_ENV !== 'development') {
        try {
          await Amplitude.init(publicRuntimeConfig.NEXT_PUBLIC_AMPLITUDE_API_KEY, currentAdmin._id);
          ref.current = true;
          setAmplitude(Amplitude);
        } catch (e) {
          console.error('Failed to initialize amplitude. Pk:', publicRuntimeConfig.NEXT_PUBLIC_AMPLITUDE_API_KEY);
        }
      }
    };

    init();
  }, [router.isReady, ref, currentAdmin?._id]);

  return (
    <AmplitudeContext.Provider value={amplitude}>
      {children}
    </AmplitudeContext.Provider>
  );
};

AmplitudeContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAmplitude = () => useContext(AmplitudeContext);
