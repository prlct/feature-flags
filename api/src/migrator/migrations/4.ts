import { promiseUtil } from 'utils';
import { featureService } from 'resources/feature';
import { Migration } from 'migrator/types';

const migration = new Migration(4, 'Rename seenBy to usersViewedCount');

migration.migrate = async () => {
  const featureIds = await featureService.distinct('_id', {});

  const updateFn = (featureId: string) =>  featureService.atomic.updateOne(
    { _id: featureId },
    { $rename: { 
      'envSettings.development.seenBy': 'envSettings.development.usersViewedCount',
      'envSettings.staging.seenBy': 'envSettings.staging.usersViewedCount',
      'envSettings.production.seenBy': 'envSettings.production.usersViewedCount',
    },
    }, 
  );

  await promiseUtil.promiseLimit(featureIds, 50, updateFn);
};

export default migration;
