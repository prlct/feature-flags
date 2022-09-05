import db from 'db';
import { map, omit } from 'lodash';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './feature.schema';
import { Feature, FeatureEnv, FlatFeature } from './feature.types';

const service = db.createService<Feature>(DATABASE_DOCUMENTS.FEATURES, { schema });

const getFeaturesForEnv = async (applicationId: string, env: FeatureEnv) => {
  const features = await service.aggregate([
    { $match: { applicationId, deletedOn: { $exists: false }  } },
    { $sort: { createdOn: -1 } },
  ]);

  const featuresForEnv = map(features, (item) => {
    const envSettings = item.envSettings[env];

    return omit({ ...item, ...envSettings, env }, ['envSettings']);
  });

  return featuresForEnv as FlatFeature[];
};

export default Object.assign(service, { getFeaturesForEnv });
