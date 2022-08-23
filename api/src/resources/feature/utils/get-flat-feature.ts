import { omit } from 'lodash';
import { FeatureEnv, Feature } from 'resources/feature';

export const getFlatFeature = (feature: Feature, env: FeatureEnv) => {
  const envSettings = feature.envSettings[env];

  return omit({ ...feature, ...envSettings, env }, ['envSettings']);
};