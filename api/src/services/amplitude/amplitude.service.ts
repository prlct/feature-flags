import * as amplitude from '@amplitude/analytics-node';
import config from 'config';

if (config.env !== 'development') {
  amplitude.init(config.AMPLITUDE_API_KEY);
}

const trackEvent = (userId: string | undefined, event: string, eventProperties: any | undefined = undefined) => {
  amplitude.track(event, eventProperties, { user_id: userId });
};

const identifyUser = (userId: string, property: string, value: any)=> {
  const identifyObj = new amplitude.Identify();
  identifyObj.setOnce(property, value);

  amplitude.identify(identifyObj, { user_id: userId });
};

export default {
  trackEvent,
  identifyUser,
};
