const apiService = require('./api.service');

const REFETCH_INTERVAL_IN_MS = 30 * 1000;

class FeatureFlags {
  constructor() {
    this.apiKey;
    this.env;
    this.user;

    this.featureFlags = {};
    this.configurations = {};
  }

  async init({ apiKey, env }, user) {    
    this.apiKey = apiKey;
    this.env = env;
    this.user = user;
    
    await this._fetchFlags();
    // TODO: Wait for the end of the request before counting down to a new
    this.intervalId = setInterval(() => this._fetchFlags(), REFETCH_INTERVAL_IN_MS);

    console.log('### init finished');
  }
  
  async identify(user)  {
    this.user = user;
    await this._fetchFlags();
  }
  
  isOn(featureName) {
    this._reportFeatureShown(featureName);

    return Boolean(this.featureFlags[featureName]);
  }
  
  getConfig(featureName) {
    return this.configurations[featureName];
  }

  async _fetchFlags() {
    const params = { env: this.env };
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.apiKey,
      },
    };

    const response = await apiService.get('/users/feature-flags', params, config);
    console.log('### response', response);
  
    this.featureFlags = response.featureFlags || {};
    this.configurations = response.configurations || {};
  }

  async _reportFeatureShown(featureName) {
    const data = { featureName };
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.apiKey,
      },
    };

    // TODO: save data to local storage and remove on success
    await apiService.post('/users/feature-shown', data, config);
  }
}

module.exports = new FeatureFlags();