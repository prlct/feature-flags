export type UnsubscribeToken = {
  _id: string,

  value: string,
  emailId: string,
  sequenceId: string,
  pipelineUserId: string,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
