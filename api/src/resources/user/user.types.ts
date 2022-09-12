import { Env } from 'resources/application';

export type User = {
  _id: string;
  applicationId: string;
  email: string;
  env: Env,
  lastVisitedOn: Date,
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};
