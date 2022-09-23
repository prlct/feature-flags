
import config from 'config';
import logger from 'logger';
import axios from 'axios';


const getDefaultOptions = (url: string): any => {
  if (!config.mailerliteSecret) {
    logger.info('Mailerlite client is not initialized.');
    return null;
  }

  const options = {
    method: 'POST',
    url: `https://api.mailerlite.com/api/v2${url}`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-MailerLite-ApiDocs': 'true',
      'X-MailerLite-ApiKey': config.mailerliteSecret,
    },
  };

  return options;
};


const getGroups = () => {
  const defaultOptions = getDefaultOptions('/groups');
  const options = {
    ...defaultOptions,
    method: 'GET',
    params: { limit: '100', offset: '0', filters: 'null' },
  };

  axios
    .request(options)
    .then(function (response) {
      logger.debug(response.data);
    })
    .catch((err: any) => {
      logger.error(`Unable to add subscriber: ${err.stack || err}`, err);
    });
};

const addOnboardingSubscriber = async ({ email, name }: { email: string, name: string }) => {
  const groupId = '67028382484792598';
  const defaultOptions = getDefaultOptions(`/groups/${groupId}/subscribers`);
  if (!defaultOptions) {
    return;
  }

  const options = {
    ...defaultOptions,
    data: {
      email,
      name,
      resubscribe: false,
      autoresponders: true,
      // type: 'null',
    },
  };

  logger.info(options);

  axios
    .request(options)
    .then(() => {
      logger.info(`${email} has been subscribed to mailerlite`);
    })
    .catch(function (err) {
      logger.error(`Unable to add subscriber: ${err.stack || err}`, err);
    });
};


export default {
  addOnboardingSubscriber,
  getGroups,
};
