export type Company = {
  _id: string;
  ownerId: string;
  applicationIds: string[];
  adminIds: string[];
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};
