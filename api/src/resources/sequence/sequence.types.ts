import Joi from 'joi';

export type Sequence = {
  _id: string,
  name: string,
  applicationId: string,
  pipelineId: string,

  trigger?: {
    name: string,
    senderEmail?: string,
    eventName?: string,
    eventKey?: string,
    stopEventKey?: string,
    allowRepeat?: boolean,
    repeatDelay?: number,
    description?: string,
  } | null,
  enabled: boolean,
  total: number,
  completed: number,
  dropped: number,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
