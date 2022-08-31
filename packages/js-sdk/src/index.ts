import apiService from './api.service';

const resource = '/feature-flags';
const storagePath = '@growthflags/js-sdk';
const consoleLogPrefix = '@growthflags/js-sdk error:';

const REFETCH_INTERVAL_IN_MS = 30 * 1000;

type Env = 'development' | 'staging' | 'production';

interface User {
  email: string;
}

interface JSONObject {
  [x: string]: JSONValue;
}

type JSONValue =
    | string
    | number
    | boolean
    | { [x: string]: JSONValue }
    | Array<JSONValue>;

interface FetchFlagsParams {
  env: Env;
  email?: string;
}

interface MainData {
  features: { [key in string]: boolean };
  configs: { [key in string]: JSONObject };
}

interface Constructor {
  publicApiKey: string;
  env: Env;
}

class FeatureFlags {
  _apiKey: string;
  _env: Env;
  _user?: User;
  _intervalId?: NodeJS.Timer;
  _features: { [key in string]: boolean }
  _configs: { [key in string]: JSONObject }

  constructor({ publicApiKey, env }: Constructor)
  {
    this._apiKey = publicApiKey;
    this._env = env;


    this._features = {};
    this._configs = {};
  }
  
  async fetchFeatureFlags(user: User)  {
    this._user = user;

    if (this._intervalId) {
      clearInterval(this._intervalId);
    }

    const storageData = this._getFromLocalStorage();

    if (storageData) {
      this._features = storageData.features || {};
      this._configs = storageData.configs || {};
    }

    this._intervalId = setInterval(() => this._fetchFlags(), REFETCH_INTERVAL_IN_MS);
    
    return this._fetchFlags();
  }
  
  isOn(featureName: string): boolean {
    // TODO: this._reportFeatureShown(featureName);
    return Boolean(this._features[featureName]);
  }
  
  getConfig(featureName: string): JSONObject {
    return this._configs[featureName];
  }

  async _fetchFlags() {
    const params: FetchFlagsParams = { env: this._env };

    if (this._user && this._user.email) {
      params.email = this._user.email;
    }

    const config = {
      headers: {
        Authorization: 'Bearer ' + this._apiKey,
      },
    };

    try {
      const response = await apiService.get(`${resource}/features`, params, config);

      this._features = response.features || {};
      this._configs = response.configs || {};

      this._saveToLocalStorage(response);
    } catch(error) {
      console.log(consoleLogPrefix, error);
    }
  }

  // Currently not in use
  async _reportFeatureShown(featureName: string) {
    const data = { featureName };
    const config = {
      headers: {
        Authorization: 'Bearer ' + this._apiKey,
      },
    };

    try {
      // TODO: save data to local storage and remove on success
      await apiService.post(`${resource}/features-shown`, data, config);
    } catch(error) {
      console.log(consoleLogPrefix, error);
    }
  }

  _saveToLocalStorage(data: MainData) {
    try {
      const stringData = JSON.stringify(data);
      localStorage.setItem(`${storagePath}`, stringData);
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }

  _getFromLocalStorage() {
    try {
      const stringData = localStorage.getItem(`${storagePath}`) || '';

      return JSON.parse(stringData);
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }
}

let instance: FeatureFlags;

export default {
  create: ({ publicApiKey, env }: Constructor) => {
    if (instance) {
      console.log(consoleLogPrefix, 'Attempting to create a second instance');

      return instance;
    } else {
      instance = new FeatureFlags({ publicApiKey, env });

      return instance;
    }
  }
};
