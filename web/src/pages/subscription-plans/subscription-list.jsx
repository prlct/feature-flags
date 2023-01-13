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
    limitEmails: 100,
    chapters: [
      {
        chapterTitle: [
          <span>
            <b>Feature flags</b>
          </span>,
        ],
        chaptersList: [
          <span>Unlimited feature flags</span>,
          <span>Unlimited feature targeting rules</span>,
          <span>Unlimited A/B tests</span>,
          <span>Remove config</span>,
          <span>
            <b>Up to 2K </b>
            <span>MAU</span>
          </span>,
        ],
      },
      {
        chapterTitle: [
          <span>
            <b>Activation pipelines</b>
          </span>,
        ],
        chaptersList: [
          <span>Unlimited subscribers</span>,
          <span>Unlimited email sequences</span>,
          <span>
            <b>Up to 3 </b>
            <span>pipelines</span>
          </span>,
          <span>
            <b>Up to 15000 </b>
            <span>monthly emails</span>
          </span>,
        ],
      },
      {
        chapterTitle: [<span />],
        chaptersList: [
          <span>
            <b>Up to 3 </b>
            <span>product users</span>
          </span>,
          <span>Onboarding and Live chat</span>,
        ],
      },
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
    limitEmails: 1000,
    chapters: [
      {
        chapterTitle: [
          <span>
            <b>Feature flags</b>
          </span>,
        ],
        chaptersList: [
          <span>Unlimited feature flags</span>,
          <span>Unlimited feature targeting rules</span>,
          <span>Unlimited A/B tests</span>,
          <span>Remove config</span>,
          <span>
            <b>Up to 10K </b>
            <span>MAU</span>
          </span>,
        ],
      },
      {
        chapterTitle: [
          <span>
            <b>Activation pipelines</b>
          </span>,
        ],
        chaptersList: [
          <span>Unlimited subscribers</span>,
          <span>Unlimited email sequences</span>,
          <span>
            <b>Up to 10 </b>
            <span>pipelines</span>
          </span>,
          <span>
            <b>Up to 30000 </b>
            <span>monthly emails</span>
          </span>,
        ],
      },
      {
        chapterTitle: [<span />],
        chaptersList: [
          <span>
            <b>Up to 10 </b>
            <span>product users</span>
          </span>,
          <span>Onboarding and Live chat</span>,
        ],
      },
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
    limitEmails: 2000,
    chapters: [
      {
        chapterTitle: [
          <span>
            <b>Feature flags</b>
          </span>,
        ],
        chaptersList: [
          <span>Unlimited feature flags</span>,
          <span>Unlimited feature targeting rules</span>,
          <span>Unlimited A/B tests</span>,
          <span>Remove config</span>,
          <span>
            <b>Up to 100K </b>
            <span>MAU</span>
          </span>,
        ],
      },
      {
        chapterTitle: [
          <span>
            <b>Activation pipelines</b>
          </span>,
        ],
        chaptersList: [
          <span>Unlimited subscribers</span>,
          <span>Unlimited email sequences</span>,
          <span>
            <b>Unlimited </b>
            <span>pipelines</span>
          </span>,
          <span>
            <b>Up to 60000 </b>
            <span>monthly emails</span>
          </span>,
        ],
      },
      {
        chapterTitle: <span />,
        chaptersList: [
          <span>
            <b>Unlimited </b>
            <span>product users</span>
          </span>,
          <span>Onboarding and Live chat</span>,
        ],
      },
    ],
  },
];
