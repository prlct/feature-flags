/* eslint-disable react/style-prop-object */
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
    subscriptionLimits: {
      emails: 500,
      mau: 2000,
      users: 3,
      pipelines: 3,
    },
    chapters: [
      {
        chaptersList: [
          <span>Onboarding</span>,
          <span>Unlimited feature flags</span>,
          <span>Unlimited A/B tests</span>,
          <span>
            <b>15000 </b>
            <span>
              monthly emails
              {' '}
              <br />
              <span>
                No more than 500 per day
              </span>
            </span>

          </span>,
        ],
      },
      {
        chaptersList: [
          <span>
            <b>3 </b>
            <span>pipelines</span>
          </span>,
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
    chapters: [
      {
        chaptersList: [
          <span>Onboarding</span>,
          <span>Unlimited feature flags</span>,
          <span>Unlimited A/B tests</span>,
          <span>
            <b>30000 </b>
            <span>monthly emails</span>
            {' '}
            <br />
            <span>
              No more than 1000 per day
            </span>
          </span>,
        ],
      },
      {
        chaptersList: [
          <span>
            <b>10 </b>
            <span>pipelines</span>
          </span>,
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
    chapters: [
      {
        chaptersList: [
          <span>Onboarding</span>,
          <span>Unlimited feature flags</span>,
          <span>Unlimited A/B tests</span>,
          <span>
            <b>60000 </b>
            <span>monthly emails</span>
            {' '}
            <br />
            <span>
              No more than 2000 per day
            </span>
          </span>,
        ],
      },
      {
        chaptersList: [
          <span>
            <b>Unlimited </b>
            <span>pipelines</span>
          </span>,
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
    ],
  },
];
