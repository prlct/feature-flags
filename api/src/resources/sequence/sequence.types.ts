import { Env } from '../application';

export type Sequence = {
  _id: string,
  name: string,
  applicationId: string,
  pipelineId: string,
  env: Env,

  trigger?: {
    name: string,
    senderEmail?: string,
    eventName?: string,
    eventKey?: string,
    stopEventKey?: string,
    allowRepeat?: boolean,
    repeatDelay?: number,
    description?: string,
    allowMoveToNextSequence: boolean,
  } | null,
  enabled: boolean,
  total: number,
  completed: number,
  dropped: number,
  index: number,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
