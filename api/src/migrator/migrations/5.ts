import { promiseUtil } from 'utils';
import { featureService } from 'resources/feature';
import { applicationService } from 'resources/application';
import { Migration } from 'migrator/types';
const migration = new Migration(5, 'Add demo env to features and applications');

const migrateApplications = async () => {
  const applicationIds = await applicationService.distinct('_id', {});

  const updateFn = (applicationId: string) => applicationService.atomic.updateOne(
    { _id: applicationId },
    { $set: { 'envs.demo': {
      totalUsersCount: 0,
    },
    } },
  );

  return promiseUtil.promiseLimit(applicationIds, 50, updateFn);
};

const migrateFeatures = async () => {
  const featureIds = await featureService.distinct('_id', {});
  const featureEnvSettings = {
    enabled: false,
    enabledForEveryone: false,
    users: [],
    usersPercentage: 0,
    usersViewedCount: 0,
    tests: [],
  };

  const updateFn = (featureId: string) =>  featureService.atomic.updateOne(
    { _id: featureId },
    { $set: { 
      'envSettings.demo': featureEnvSettings,
    },
    }, 
  );

  return promiseUtil.promiseLimit(featureIds, 50, updateFn);
};

migration.migrate = async () => {
  await Promise.all([
    migrateApplications(),
    migrateFeatures(),
  ]);
};

export default migration;
