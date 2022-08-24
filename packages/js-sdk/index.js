const apiService = require('./api.service');

const resource = '/js-sdk/public/v1';
const storagePath = '@growthflags/js-sdk';
const consoleLogPrefix = '@growthflags/js-sdk error:';

const REFETCH_INTERVAL_IN_MS = 30 * 1000;

class FeatureFlags {
  constructor({ publicApiKey, env }) {
    this.apiKey = publicApiKey;
    this.env = env;

    this.user;
    this.intervalId;

    this.features = {};
    this.configs = {};
  }
  
  async fetchFeatureFlags(user)  {
    this.user = user;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const storageData = this._getFromLocalStorage();

    if (storageData) {
      this.features = storageData.features || {};
      this.configs = storageData.configs || {};
    }

    this.intervalId = setInterval(() => this._fetchFlags(), REFETCH_INTERVAL_IN_MS);
    
    return this._fetchFlags();
  }
  
  isOn(featureName) {
    // TODO: this._reportFeatureShown(featureName);
    return Boolean(this.features[featureName]);
  }
  
  getConfig(featureName) {
    return this.configs[featureName];
  }

  async _fetchFlags() {
    const params = { env: this.env };

    if (this.user && this.user.email) {
      params.email = this.user.email;
    }

    const config = {
      headers: {
        Authorization: 'Bearer ' + this.apiKey,
      },
    };

    try {
      const response = await apiService.get(`${resource}/features`, params, config);

      this.features = response.features || {};
      this.configs = response.configs || {};

      this._saveToLocalStorage(response);
    } catch(error) {
      console.log(consoleLogPrefix, error);
    }
  }

  // Currently not in use
  async _reportFeatureShown(featureName) {
    const data = { featureName };
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.apiKey,
      },
    };

    try {
      // TODO: save data to local storage and remove on success
      await apiService.post(`${resource}/features-shown`, data, config);
    } catch(error) {
      console.log(consoleLogPrefix, error);
    }
  }

  _saveToLocalStorage(data) {
    try {
      const stringData = JSON.stringify(data);
      localStorage.setItem(`${storagePath}`, stringData);
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }

  _getFromLocalStorage() {
    try {
      const stringData = localStorage.getItem(`${storagePath}`);
      return JSON.parse(stringData);
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }
}

let instance;

module.exports = {
  create: ({ publicApiKey, env }) => {
    if (instance) {
      console.log(consoleLogPrefix, 'Attempting to create a second instance');

      return instance;
    } else {
      instance = new FeatureFlags({ publicApiKey, env });

      return instance;
    }
  }
};
