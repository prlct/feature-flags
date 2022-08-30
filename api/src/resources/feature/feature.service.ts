import db from 'db';
import { Filter, UpdateOptions, QueryDefaultsOptions } from '@paralect/node-mongo';
import { map, omit } from 'lodash';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './feature.schema';
import { Feature, FeatureEnv, FlatFeature } from './feature.types';

const service = db.createService<Feature>(DATABASE_DOCUMENTS.FEATURES, { schema });

const getFeaturesForEnv = async (applicationId: string, env: FeatureEnv) => {
  const features = await service.aggregate([
    { $match: { applicationId } },
    { $sort: { createdOn: -1 } },
  ]);

  const featuresForEnv = map(features, (item) => {
    const envSettings = item.envSettings[env];

    return omit({ ...item, ...envSettings, env }, ['envSettings']);
  });

  return featuresForEnv as FlatFeature[];
};

const updateOne = async (
  query: Filter<Feature>,
  updateFn: (doc: Feature) => Partial<Feature>,
  options: UpdateOptions & QueryDefaultsOptions = {},
) => {
  if (query.name && !query.applicationId) {
    throw new Error('Forbidden to update feature without applicationId');
  }

  return service.updateOne(query, updateFn, options);
};

export default Object.assign(service, { getFeaturesForEnv, updateOne });
