export type UnsubscribeToken = {
  _id: string,

  value: string,
  emailId: string,
  sequenceId: string,
  pipelineUserId: string,
  applicationId: string,
  targetEmail: string,
  companyName: string,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
