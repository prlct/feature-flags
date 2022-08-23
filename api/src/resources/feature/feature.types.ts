// Fix featureEnvValues array in other files if you change FeatureEnv enum
export enum FeatureEnv {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

type EnvSettings = {
  enabled: boolean;
  enabledForEveryone: boolean;
  users: string[];
  usersPercentage: number;
  seenBy: number;
  tests: string[];
};

export type Feature = {
  _id: string;
  applicationId: string;
  name: string;
  description: string;
  envSettings: {
    [FeatureEnv.DEVELOPMENT]: EnvSettings,
    [FeatureEnv.STAGING]: EnvSettings,
    [FeatureEnv.PRODUCTION]: EnvSettings,
  }
  createdOn: string;
  updatedOn: string;
  deletedOn?: string;
};
