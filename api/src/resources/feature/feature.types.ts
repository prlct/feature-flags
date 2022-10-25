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

export type ABVariant = {
  name: string,
  remoteConfig: string,
};

export type EnvSettings = {
  enabled: boolean;
  enabledForEveryone: boolean;
  usersPercentage: number;
  usersViewedCount: number;
  tests: ABVariant[];
  targetingRules?: TargetingRule[];
  visibilityChangedOn?: Date;
  remoteConfig: string,
};

export type Changes = {
  featureId: string,
  env: Env,
  changedOn: Date,
  admin: {
    _id: string,
    email: string,
  };
  data: {
    enabled?: boolean;
    enabledForEveryone?: boolean;
    usersPercentage?: number;
    usersViewedCount?: number;
    tests?: ABVariant[];
    targetingRules?: TargetingRule[];
    remoteConfig?: string,
  }
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
  changeHistory?: Changes[] | null,
};

export type FlatFeature = Omit<Feature, 'envSettings'> & EnvSettings & { env: Env };

export type UserFeature = {
  enabled: boolean,
  remoteConfig?: string | null,
};
