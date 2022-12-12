export type Pipeline = {
  _id: string,
  name: string,
  applicationId: string,
  env: string,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
