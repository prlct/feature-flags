import apiService from './api.service';

const featureFlagResource = '/feature-flags';
const userResource = '/users';
const userEventResource = '/user-events';
const storagePath = '@growthflags/js-sdk';
const consoleLogPrefix = '@growthflags/js-sdk error:';

enum UserEventType {
  FeatureViewed = 'featureViewed',
}

interface AppUser {
  email?: string;
}

interface User {
  _id: string;
  applicationId: string;
  email: string;
  env: string,
  lastVisitedOn: Date,
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
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
  env: string;
  email?: string;
  userId?: string
}

interface CreateUserData {
  env: string;
  email: string;
}

interface CreateUserEventData {
  userId: string;
  type: UserEventType;
  data: {
    featureName?: string
  }
};

interface LocalStorageData {
  features: { [key in string]: boolean };
  configs: { [key in string]: JSONObject };
  user?: User
}

interface Constructor {
  publicApiKey: string;
  env: string;
}

export type FeatureOverride = {
  name: string;
  enabled: boolean;
}

class FeatureFlags {
  private _apiKey: string;
  private _env: string;
  private _user?: User;
  private _features: { [key in string]: boolean }
  // custom feature overrides set by users to override on the specific environment (e.g. dev)
  private _featureOverrides: FeatureOverride[];
  private _configs: { [key in string]: JSONObject }

  constructor({ publicApiKey, env }: Constructor) {
    this._apiKey = publicApiKey;
    this._env = env;


    this._features = {};
    this._featureOverrides = []
    this._configs = {};
  }
  
  async fetchFeatureFlags(user: AppUser)  {
    if (user?.email) {
        await this._createUser(user.email);
    } 

    const storageData = this._getFromLocalStorage();

    if (storageData) {
      this._features = storageData.features || {};
      this._configs = storageData.configs || {};
    }
    
    return this._fetchFlags();
  }
  
  isOn(featureName: string): boolean {
    return Boolean(this._features[featureName]);
  }

  private mergeFeatures(features: { [key in string]: boolean }) {
    let newFeatures = features;
    this._featureOverrides.forEach((featureOverride: FeatureOverride) => {
      newFeatures[featureOverride.name] = featureOverride.enabled;
    });

    return newFeatures;
  }

  setFeatures(featureOverrides: FeatureOverride[]) {
    this._featureOverrides = featureOverrides;

    this._features = this.mergeFeatures(this._features)
  }
  
  getConfig(featureName: string): JSONObject {
    return this._configs[featureName];
  }

  async trackFeatureView(featureName: string) {
    console.log(featureName)
    if (!this._user) return;

    const data: CreateUserEventData = { 
      userId: this._user?._id,
      type: UserEventType.FeatureViewed,
      data: {
        featureName
      }
    } ;

    const config = {
      headers: {
        Authorization: 'Bearer ' + this._apiKey,
      },
    };

    try {
       await apiService.post(`${userEventResource}`, data, config);
    } catch(error) {
      console.log(consoleLogPrefix, error);
    }
  }

  private async _fetchFlags() {
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
      const response = await apiService.get(`${featureFlagResource}/features`, params, config);

      const features = response.features || {};
      this._features = this.mergeFeatures(features);
      this._configs = response.configs || {};

      this._saveToLocalStorage(response);
    } catch(error) {
      console.log(consoleLogPrefix, error);
    }
  }

  private async _createUser(email: string) {
    const data: CreateUserData = { env: this._env, email: email };

    const config = {
      headers: {
        Authorization: 'Bearer ' + this._apiKey,
      },
    };

    try {
      const response = await apiService.post(`${userResource}`, data, config);

      this._user = response;
      this._saveToLocalStorage({ user: response })
    } catch(error) {
      console.log(consoleLogPrefix, error);
    }
  }

  private _saveToLocalStorage(data: JSONObject) {
    try {
      const localStorageData : LocalStorageData = this._getFromLocalStorage();
      const updatedData = {...localStorageData, ...data};
      const stringData = JSON.stringify(updatedData);
      
      localStorage.setItem(`${storagePath}`, stringData);
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }

  private _getFromLocalStorage() {
    try {
      const localStorageData = localStorage.getItem(`${storagePath}`);
      
      return localStorageData ? JSON.parse(localStorageData): {};
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }
}

let instance: FeatureFlags;

export default {
  create: ({ publicApiKey, env }: Constructor) => {
    if (instance) {
      return instance;
    }

    instance = new FeatureFlags({ publicApiKey, env });

    return instance;
  }
};
