export type Sequence = {
  id: string,
  name: string,
  applicationId: string,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
