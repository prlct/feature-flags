import config from 'config';

export default [
  {
    id: '0',
    title: 'Basic',
    price: 0,
    features: [
      <span>Onboarding</span>,
      <span>Unlimited Growthflags</span>,
      <span>Unlimited A/B tests</span>,
      <span>Up to <b>3</b> product users</span>,
      <span>Up to <b>2K</b> MAU</span>
    ],
  },
  {
    id: config.subscriptions.starter,
    title: 'Starter',
    price: 49,
    features: [
      <span>Onboarding</span>,
      <span>Unlimited Growthflags</span>,
      <span>Unlimited A/B tests</span>,
      <span>Up to <b>10</b> product users</span>,
      <span>Up to <b>10K</b> MAU</span>
    ],
  },
  {
    id: config.subscriptions.pro,
    title: 'Pro',
    price: 99,
    features: [
      <span>Onboarding</span>,
      <span>Unlimited Growthflags</span>,
      <span>Unlimited A/B tests</span>,
      <span><b>Unlimited</b> product users</span>,
      <span>Up to <b>100K</b> MAU</span>
    ],
  },
]