export type Application = {
  _id: string;
  companyId: string;
  publicApiKey: string;
  privateApiKey: string;
  featureIds: string[];
  createdOn: string;
  updatedOn: string;
  deletedOn?: string;
};
