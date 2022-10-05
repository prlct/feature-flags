import { promiseUtil } from 'utils';
import { featureService } from 'resources/feature';
import { Migration } from 'migrator/types';

const migration = new Migration(7, 'Remove users from the feature env settings');

migration.migrate = async () => {
  const featureIds = await featureService.distinct('_id', {});

  const updateFn = (featureId: string) =>  featureService.atomic.updateOne(
    { _id: featureId },
    { $unset: { 
      'envSettings.development.users': '',
      'envSettings.staging.users': '',
      'envSettings.demo.users': '',
      'envSettings.production.users': '',
    },
    }, 
  );

  await promiseUtil.promiseLimit(featureIds, 50, updateFn);
};

export default migration;
