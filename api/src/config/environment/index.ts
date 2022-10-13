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
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  redis: 'redis://:@redis:6379',
  adminKey: '',
  MAGIC_SECRET_KEY: process.env.MAGIC_SECRET_KEY || '',
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
  mailerliteSecret: process.env.MAILERLITE_SECRET || '',
  STRIPE_API_KEY: process.env.STRIPE_API_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  MONTHLY_ACTIVE_USERS_LIMIT: process.env.MONTHLY_ACTIVE_USERS_LIMIT || 2000,
};

const config = configUtil.loadConfig(base, env, __dirname);

export default config;
