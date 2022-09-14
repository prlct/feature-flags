import { Env } from 'resources/application';

type EventData = {
  featureId?: string;
  featureName?: string;
};

export enum UserEventType {
  FeatureViewed = 'featureViewed',
}

export type UserEvent = {
  _id: string;

  userId: string;
  applicationId: string;
  env: Env;
  type: UserEventType;
  data: EventData;

  createdOn: Date;
};

