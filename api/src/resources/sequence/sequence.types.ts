export type Sequence = {
  id: string,
  name: string,
  applicationId: string,
  pipelineId: string,

  enabled: boolean,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
