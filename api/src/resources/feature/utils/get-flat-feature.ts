import { omit } from 'lodash';
import { Env } from 'resources/application';
import { Feature } from 'resources/feature';

export const getFlatFeature = (feature: Feature, env: Env) => {
  const envSettings = feature.envSettings[env];

  return omit({ ...feature, ...envSettings, env }, ['envSettings', 'history']);
};