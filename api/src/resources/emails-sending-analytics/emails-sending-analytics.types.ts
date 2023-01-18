export type AnalyticsType = {
  [key: string]: number,
};

export type EmailsSendingAnalytics = {
  _id: string;
  companyId: string;
  sendingEmails: AnalyticsType
  adminId: string;
  expirationOn: Date;
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};