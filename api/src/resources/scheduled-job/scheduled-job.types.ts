export type ScheduledEmailOptions = {
  emailId: string,
  pipelineId: string,
  targetEmail: string,
  firstName?: string,
  lastName?: string,
};

export type ScheduledJob = {
  _id: string,

  applicationId: string,
  type: string,
  data: ScheduledEmailOptions,
  status: ScheduledJobStatus,
  result?: string,

  scheduledDate: Date,

  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};

export enum ScheduledJobType {
  EMAIL_SEQUENCE_SEND = 'email-sequence-send',
  DELAYED_CHECK = 'delayed-check',
}

export enum ScheduledJobStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

