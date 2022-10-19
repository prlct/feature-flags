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

type EnvSettings = {
  enabled: boolean;
  enabledForEveryone: boolean;
  usersPercentage: number;
  usersViewedCount: number;
  tests: ABVariant[];
  targetingRules?: TargetingRule[];
  visibilityChangedOn?: Date;
  remoteConfig: string,
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

export type UserFeature = {
  enabled: boolean,
  remoteConfig?: string | null,
};
