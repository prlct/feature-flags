export type Company = {
  _id: string;
  ownerId: string;
  applicationIds: string[];
  adminIds: string[];
  createdOn: string;
  updatedOn: string;
  deletedOn?: string;
};
