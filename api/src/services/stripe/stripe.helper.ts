import config from 'config';

export const getPlanInformation = async (planId: string) => {
  switch (planId) {
    case config.subscriptions.pro:
      return {
        plan: 'Pro',
        usersLimit: 'Unlimited',
        mauLimit: '100K',
      };
    case config.subscriptions.starter:
      return {
        plan: 'Starter',
        usersLimit: '10',
        mauLimit: '10K',
      };
    default:
      return; 
  }
};