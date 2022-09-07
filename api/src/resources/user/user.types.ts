export type User = {
  _id: string;
  applicationId: string;
  sessionId: string;
  externalId: string;
  email: string;
  fullName: string;
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};
