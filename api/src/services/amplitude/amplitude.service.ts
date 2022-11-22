import * as amplitude from '@amplitude/analytics-node';
import config from 'config';
import { AppKoaContext } from 'types';

if (config.env !== 'development') {
  amplitude.init(config.AMPLITUDE_API_KEY);
}

const trackEvent = (ctx:AppKoaContext, event: string, eventProperties: any | undefined = undefined) => {
  amplitude.track(event, eventProperties, { user_id: ctx.state.admin?._id });
};

const identifyUser = (ctx:AppKoaContext, property: string, value: any)=> {
  const identifyObj = new amplitude.Identify();
  identifyObj.setOnce(property, value);

  amplitude.identify(identifyObj, { user_id: ctx.state.admin?._id });
};

export default {
  trackEvent,
  identifyUser,
};
