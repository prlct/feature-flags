module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  trailingSlash: true,
  pageExtensions: ['page.jsx', 'api.js'],
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GROWTHFLAGS_PUBLIC_KEY: process.env.NEXT_PUBLIC_GROWTHFLAGS_PUBLIC_KEY,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_CRISP_WEBSITE_ID: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID,
    NEXT_PUBLIC_HOTJAR_ID: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },
};
