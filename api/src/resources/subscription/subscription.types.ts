type SubscriptionLimits = {
  emails: number | null,
  mau: number,
  pipelines: number | null,
  users: number | null,
};

export type Subscription = {
  _id: string;
  subscriptionId: string,
  planId: string
  productId: string,
  customer: string,
  status: string,
  subscriptionLimits: SubscriptionLimits,
  name: string,
  interval: string,
  startDate: Date,
  endDate: Date,
  cancelAtPeriodEnd: boolean,
  createdOn: Date,
  updatedOn: Date,
};
