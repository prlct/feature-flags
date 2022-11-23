export type SequenceEmail = {
  id: string,
  name: string,
  applicationId: string,

  subject: string,
  body: string,
  enabled: boolean,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
