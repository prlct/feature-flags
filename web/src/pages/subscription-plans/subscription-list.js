import config from 'config';

export default [
  {
    planIds: {
      month: '0',
      year: '0',
    },
    title: 'Basic',
    price: {
      month: 0,
      year: 0,
    },
    features: [
      <span>Onboarding</span>,
      <span>Unlimited Growthflags</span>,
      <span>Unlimited A/B tests</span>,
      <span>Up to <b>3</b> product users</span>,
      <span>Up to <b>2K</b> MAU</span>
    ],
  },
  {
    planIds: {
      month: config.subscriptions.starter.month,
      year: config.subscriptions.starter.year
    },
    title: 'Starter',
    price: {
      month: 49,
      year: 510,
    },
    features: [
      <span>Onboarding</span>,
      <span>Unlimited Growthflags</span>,
      <span>Unlimited A/B tests</span>,
      <span>Up to <b>10</b> product users</span>,
      <span>Up to <b>10K</b> MAU</span>
    ],
  },
  {
    planIds: {
      month: config.subscriptions.pro.month,
      year: config.subscriptions.pro.year,
    },
    title: 'Pro',
    price: {
      month: 99,
      year: 1020,
    },
    features: [
      <span>Onboarding</span>,
      <span>Unlimited Growthflags</span>,
      <span>Unlimited A/B tests</span>,
      <span><b>Unlimited</b> product users</span>,
      <span>Up to <b>100K</b> MAU</span>
    ],
  },
];
