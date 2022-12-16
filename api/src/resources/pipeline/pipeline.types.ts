export type Pipeline = {
  _id: string,
  name: string,
  applicationId: string,
  env: string,
  index: number,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
