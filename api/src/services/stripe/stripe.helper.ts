import stripe from './stripe.service';

export const getPlanInformation = async (subscriptionId: string) => {

  console.log(subscriptionId);

  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

  console.log(subscription);
};