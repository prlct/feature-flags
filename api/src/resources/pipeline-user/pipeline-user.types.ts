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
  finished: boolean,
  sequenceHistory?: {
    [key in string]: Date;
  },

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
