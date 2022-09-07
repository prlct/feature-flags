export type Application = {
  _id: string;
  companyId: string;
  publicApiKey: string;
  privateApiKey: string;
  featureIds: string[];
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};
