type EventData = {
  featureId?: string;
  featureName?: string;
};

export type UserEvent = {
  _id: string;

  userId: string;
  event: EventType;
  data: EventData;

  createdOn: Date;
};

export enum EventType {
  FeatureViewed = 'featureViewed',
}