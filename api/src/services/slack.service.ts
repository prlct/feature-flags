import { IncomingWebhook } from '@slack/webhook';
import config from 'config';
import logger from 'logger';

// Initialize
const webhook = new IncomingWebhook(config.slackWebhookUrl);

export default {
  send: (text: string) => {
    return webhook.send({
      text,
    }).catch((err) => {
      console.dir(err);
      logger.error('Failed to send slack webhook', { err: err.stack || err });
    });
  },
};
