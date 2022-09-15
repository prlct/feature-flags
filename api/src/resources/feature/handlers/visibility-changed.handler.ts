import { get } from 'lodash';
import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { DATABASE_DOCUMENTS } from 'app.constants';
import { Env } from 'resources/application';
import featureService from '../feature.service';
import type { Feature } from '../feature.types';
const { FEATURES } = DATABASE_DOCUMENTS;

eventBus.on(`${FEATURES}.updated`, async (data: InMemoryEvent<Feature>) => {
  const feature  = data.doc;
  const prevFeature = data.prevDoc;
  
  for (const env of Object.values(Env)) {
    const path = `envSettings.${env}.visibilityChangedOn`;
    const value = get(feature, path);
    const prevValue = get(prevFeature, path);
  
    if (value !== prevValue) {
      await featureService.atomic.updateOne(
        { _id: feature._id },
        { $set: { [`envSettings.${[env]}.usersViewedCount`]: 0 } },
      );
    }
  }
});
