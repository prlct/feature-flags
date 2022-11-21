import apiService from './api.service';
import storage from './storage'

const featureFlagResource = '/feature-flags';
const userResource = '/users';
const userEventResource = '/user-events';
const storagePath = '@growthflags/js-sdk';
const consoleLogPrefix = '@growthflags/js-sdk error:';

export interface Constructor {
  publicApiKey: string;
  env: string;
  defaultFeatures: { [key: string]: boolean };
}

export enum UserEventType {
  FeatureViewed = 'featureViewed',
}

export interface AppUser {
  id?: string;
  email?: string;
  data?: { [key: string]: any }
}

export interface User {
  _id: string;
  applicationId: string;
  email: string;
  externalId: string;
  env: string,
  lastVisitedOn: Date,
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
}

export interface JSONObject {
  [x: string]: JSONValue;
}

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export interface FetchFlagsParams {
  env: string;
  userId?: string;
}

export interface CreateUserParams {
  id?: string;
  email?: string;
  data?: { [key in string]: any }
}

export type CreateUserData = {
  env: string;
} & CreateUserParams

export interface CreateUserEventData {
  userId: string;
  type: UserEventType;
  data: {
    featureName?: string
  }
}

export interface LocalStorageData {
  features: { [key in string]: boolean };
  configs: { [key in string]: JSONObject };
  user?: User
}

export type FeatureOverride = {
  name: string;
  enabled: boolean;
}

export type ABVariant = {
  name: string,
  config: string
}

class FeatureFlags {
  private _apiKey: string;
  private _env: string;
  private _user?: User;
  private _features: { [key in string]: boolean }
  // custom feature overrides set by users to override on the specific environment (e.g. dev)
  private _featureOverrides: FeatureOverride[];
  private _configs: { [key in string]: string };
  private _variants: { [key in string]: ABVariant };

  constructor({ publicApiKey, env, defaultFeatures = {} }: Constructor) {
    this._apiKey = publicApiKey;
    this._env = env;


    this._features = defaultFeatures;
    this._featureOverrides = []
    this._configs = {};
    this._variants = {};
  }

  async fetchFeatureFlags(user: AppUser) {
    if (user?.email || user?.id) {
      await this._createUser({
        id: user.id,
        email: user.email,
        data: user.data
      });
    }

    const storageData = this._getFromStorage();

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

  getFeature(featureName: string, options: { defaultConfig?: JSONObject } = {}) {
    return {
      name: featureName,
      enabled: this.isOn(featureName),
      config: this.getConfig(featureName, options.defaultConfig),
      variant: this.getVariant(featureName),
    };
  }

  getVariant(featureName: string) {
    return this._variants[featureName] || { name: 'mainVariant', remoteConfig: this.getConfig(featureName) };
  }

  getConfig(featureName: string, defaultConfig?: JSONObject): JSONObject | undefined {
    if (this._configs[featureName]) {
      return JSON.parse(this._configs[featureName]);
    }
    return defaultConfig;
  }

  async trackFeatureView(featureName: string) {
    if (!this._user) return;

    const data: CreateUserEventData = {
      userId: this._user?._id,
      type: UserEventType.FeatureViewed,
      data: {
        featureName
      }
    };

    const config = {
      headers: {
        Authorization: 'Bearer ' + this._apiKey,
      },
    };

    try {
      await apiService.post(userEventResource, data, config);
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }

  private async _fetchFlags() {
    const params: FetchFlagsParams = { env: this._env };

    if (this._user) {
      params.userId = this._user._id;
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
      this._variants = response.variants || {};

      this._saveToStorage(response);

      return response;
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }

  private async _createUser(user: CreateUserParams) {
    const { id, email, data } = user;
    const reqData: CreateUserData = { env: this._env, id, email, data };

    const config = {
      headers: {
        Authorization: 'Bearer ' + this._apiKey,
      },
    };

    try {
      const response = await apiService.post(`${userResource}`, reqData, config);

      this._user = response;

      this._saveToStorage({ user: response })
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }

  private _saveToStorage(data: JSONObject) {
    if (!storage) {
      return;
    }

    try {
      const localStorageData: LocalStorageData = this._getFromStorage();

      const updatedData = localStorageData ? { ...localStorageData, ...data } : { ...data };
      const stringData = JSON.stringify(updatedData);

      storage.setItem(`${storagePath}`, stringData);
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }

  private _getFromStorage() {
    if (!storage) {
      return null
    }

    try {
      const localStorageData = storage.getItem(`${storagePath}`);

      return localStorageData ? JSON.parse(localStorageData) : null;
    } catch (error) {
      console.log(consoleLogPrefix, error);
    }
  }
}

let instance: FeatureFlags;

export default {
  create: ({ publicApiKey, env, defaultFeatures }: Constructor) => {
    if (!publicApiKey) {
      throw new RangeError('Invalid arguments: "publicApiKey" must be provided.');
    }

    if (!env) {
      throw new RangeError('Invalid arguments: "env" must be provided.');
    }

    if (instance) {
      return instance;
    }

    instance = new FeatureFlags({ publicApiKey, env, defaultFeatures });

    return instance;
  }
};
