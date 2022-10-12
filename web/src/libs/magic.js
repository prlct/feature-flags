import { Magic } from 'magic-sdk';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// Create client-side Magic instance
const createMagic = (key) => (
  typeof window !== 'undefined'
    && new Magic(key)
);

export const magic = createMagic(publicRuntimeConfig.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
