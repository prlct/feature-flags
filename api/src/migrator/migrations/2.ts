import { featureService } from 'resources/feature';
import { Migration } from 'migrator/types';

const migration = new Migration(2, 'Add TTL index to features');

migration.migrate = async () => {
  await featureService.createIndex({ 'deletedOn': 1 }, { expireAfterSeconds: 3 * 30 * 24 * 60 * 60 }); // 3 months
};

export default migration;
