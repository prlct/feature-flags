export type Sequence = {
  _id: string,
  name: string,
  applicationId: string,
  pipelineId: string,

  trigger: object | null,
  enabled: boolean,
  total: number,
  completed: number,
  dropped: number,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
