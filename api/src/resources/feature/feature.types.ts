import { Env } from 'resources/application';

type EnvSettings = {
  enabled: boolean;
  enabledForEveryone: boolean;
  users: string[];
  usersPercentage: number;
  usersViewedCount: number;
  tests: string[];
  visibilityChangedOn?: Date;
};

export type Feature = {
  _id: string;
  applicationId: string;
  name: string;
  description: string;
  envSettings: {
    [Env.DEVELOPMENT]: EnvSettings,
    [Env.STAGING]: EnvSettings,
    [Env.PRODUCTION]: EnvSettings,
  }
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};

export type FlatFeature = Omit<Feature, 'envSettings'> & EnvSettings & { env: Env };