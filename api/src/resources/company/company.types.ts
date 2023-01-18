export type Company = {
  _id: string;
  ownerId: string;
  applicationIds: string[];
  adminIds: string[];
  stripeId: string | null;
  freeLimitUsed: boolean | null;
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};
