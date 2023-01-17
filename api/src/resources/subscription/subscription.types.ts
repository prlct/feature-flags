type SubscriptionLimits = {
  emails: number,
  mau: number,
  pipelines: number | null,
  users: number | null,
};

export type Subscription = {
  _id: string;
  companyId: string,
  subscriptionId: string,
  planId: string
  productId: string,
  customer: string,
  status: string,
  subscriptionLimits: SubscriptionLimits,
  name: string,
  interval: string,
  startDate: number,
  endDate: number,
  cancelAtPeriodEnd: boolean,
  createdOn: Date,
  updatedOn: Date,
};
