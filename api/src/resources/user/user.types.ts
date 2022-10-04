import { Env } from 'resources/application';

export type User = {
  _id: string;
  applicationId: string;
  email?: string;
  externalId: string;
  env: Env,
  data: { [key: string]: any };
  lastVisitedOn: Date,
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};
