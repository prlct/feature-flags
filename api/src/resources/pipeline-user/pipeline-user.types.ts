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
    lastEmailId?: string | null,
    pendingEmailId?: string | null,
  },

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
