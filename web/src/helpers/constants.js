export const ENV = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  DEMO: 'demo',
  PRODUCTION: 'production',
};

export const LOCAL_STORAGE_ENV_KEY = 'selectedAppEnv';

export const TARGETING_RULES_OPERATORS = {
  EQUALS: 'equals',
  INCLUDES: 'includes',
};

export const DEFAULT_TARGETING_RULE = {
  attribute: 'email',
  value: '',
  description: '',
  operator: TARGETING_RULES_OPERATORS.EQUALS,
};
