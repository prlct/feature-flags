import { configUtil } from 'utils';
const env = process.env.APP_ENV || 'development';

const base = {
  env,
  port: process.env.PORT || 3001,
  isDev: env === 'development',
  mongo: {
    connection: process.env.MONGO_CONNECTION || '',
    dbName: '',
  },
  cloudStorage: {
    bucket: '',
    endpoint: '',
  },
  apiUrl: '',
  webUrl: '',
  sendgridApiKey: '',
  redis: 'redis://:@redis:6379',
  adminKey: '',
  MAGIC_SECRET_KEY: process.env.MAGIC_SECRET_KEY || '',
};

const config = configUtil.loadConfig(base, env, __dirname);

export default config;
