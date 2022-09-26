export type Subscription = {
  _id: string;
  subscriptionId: string,
  planId: string,
  customer: string,
  status: string,
  startDate: Date,
  endDate: Date,
  cancelAtPeriodEnd: boolean,
  createdOn: Date,
  updatedOn: Date,
};
