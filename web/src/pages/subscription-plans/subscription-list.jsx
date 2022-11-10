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
      <span>
        <b>Up to 3 </b>
        <span>product users</span>
      </span>,
      <span>
        <b>Up to 2K </b>
        <span>MAU</span>
      </span>,
    ],
  },
  {
    planIds: {
      month: config.subscriptions.starter.month,
      year: config.subscriptions.starter.year,
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
      <span>
        <b>Up to 10 </b>
        <span>product users</span>
      </span>,
      <span>
        <b>Up to 10K </b>
        <span>MAU</span>
      </span>,
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
      <span>
        <b>Unlimited </b>
        <span>product users</span>
      </span>,
      <span>
        <b>Up to 100K </b>
        <span>MAU</span>
      </span>,
    ],
  },
];
