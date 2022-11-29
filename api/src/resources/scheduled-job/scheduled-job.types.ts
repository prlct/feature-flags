export type ScheduledJob = {
  _id: string,

  applicationId: string,
  type: string,
  data: object,
  status: ScheduledJobStatus,
  result: string,

  scheduledDate: Date,
};

export enum ScheduledJobType {
  EMAIL_SEQUENCE_SEND = 'email-sequence-send',
}

export enum ScheduledJobStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

