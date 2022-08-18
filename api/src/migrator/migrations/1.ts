import { promiseUtil } from 'utils';
import { adminService } from 'resources/admin';
import { Migration } from 'migrator/types';

const migration = new Migration(1, 'Example');

migration.migrate = async () => {
  const adminIds = await adminService.distinct('_id', {
    isEmailVerified: true,
  });

  const updateFn = (adminId: string) => adminService.atomic.updateOne(
    { _id: adminId },
    { $set: { isEmailVerified: false } },
  );

  await promiseUtil.promiseLimit(adminIds, 50, updateFn);
};

export default migration;
