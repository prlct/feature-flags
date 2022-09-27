import { Env } from 'resources/application';

export enum TargetingRuleOperator {
  EQUALS = 'equals',
  INCLUDES = 'includes',
}

export type TargetingRule = {
  attribute: string;
  operator: TargetingRuleOperator;
  value: string | string[]
};

type EnvSettings = {
  enabled: boolean;
  enabledForEveryone: boolean;
  users: string[];
  usersPercentage: number;
  usersViewedCount: number;
  tests: string[];
  targetingRules?: TargetingRule[];
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
    [Env.DEMO]: EnvSettings,
    [Env.PRODUCTION]: EnvSettings,
  }
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};

export type FlatFeature = Omit<Feature, 'envSettings'> & EnvSettings & { env: Env };