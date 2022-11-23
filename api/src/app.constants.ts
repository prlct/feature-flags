const DATABASE_DOCUMENTS = {
  ADMINS: 'admins',
  TOKENS: 'tokens',
  COMPANIES: 'companies',
  APPLICATIONS: 'applications',
  FEATURES: 'features',
  USERS: 'users',
  INVITATIONS: 'invitations',
  USER_EVENTS: 'user-events',
  SUBSCRIPTIONS: 'subscriptions',
  STATISTICS: 'statistics',
  PIPELINES: 'pipelines',
  SEQUENCES: 'sequences',
};

const COOKIES = {
  ACCESS_TOKEN: 'access_token',
};

const TOKEN_SECURITY_LENGTH = 32;
const INVITATION_TOKEN_SECURITY_LENGTH = 32;
const PUBLIC_API_KEY_SECURITY_LENGTH = 24;
const PRIVATE_API_KEY_SECURITY_LENGTH = 24;

export {
  DATABASE_DOCUMENTS,
  COOKIES,
  INVITATION_TOKEN_SECURITY_LENGTH,
  TOKEN_SECURITY_LENGTH,
  PUBLIC_API_KEY_SECURITY_LENGTH,
  PRIVATE_API_KEY_SECURITY_LENGTH,
};
