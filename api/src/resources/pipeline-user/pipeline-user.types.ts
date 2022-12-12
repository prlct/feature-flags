export type PipelineUser = {
  _id: string,
  firstName?: string,
  lastName?: string,
  email: string,
  applicationId: string,
  pipeline?: {
    _id: string,
    name: string,
  },
  sequence?: {
    _id: string,
    name: string,
    lastEmailId?: string,
    pendingEmailId?: string,
  },

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
