import { createContext, useContext, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import * as Amplitude from '@amplitude/analytics-browser';

const { publicRuntimeConfig } = getConfig();

const AmplitudeContext = createContext(null);

export const AmplitudeContextProvider = ({ children }) => {
  const router = useRouter();
  const ref = useRef(false);
  const [amplitude, setAmplitude] = useState(null);

  useEffect(() => {
    if (router.isReady && !ref.current) {
      ref.current = true;
      Amplitude.init(publicRuntimeConfig.NEXT_PUBLIC_AMPLITUDE_API_KEY);
      setAmplitude(Amplitude);
    }
  }, [router.isReady, ref]);

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
