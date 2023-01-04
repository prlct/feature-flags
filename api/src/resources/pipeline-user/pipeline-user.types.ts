export type PipelineUser = {
  _id: string,
  firstName?: string,
  lastName?: string,
  email: string,
  applicationId: string,
  pipelines: {
    _id: string,
    name: string,
    droppedOn?: Date | null,
  }[],
  sequences: {
    _id: string,
    pipelineId: string,
    name: string,
    finishedOn?: Date | null,
    pendingEmail?: string,
    lastEmail?: string,
  }[],

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
