export type SequenceEmail = {
  _id: string,
  name: string,
  applicationId: string,

  delayDays: number,
  sequenceId: string,
  subject: string,
  body: string,
  enabled: boolean,
  sent: number,
  unsubscribed: number,
  index: number,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
