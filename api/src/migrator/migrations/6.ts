import { promiseUtil } from 'utils';
import { userService } from 'resources/user';
import type { User } from 'resources/user';
import { Migration } from 'migrator/types';

const migration = new Migration(6, 'Copy email to externalId');

migration.migrate = async () => {
  const { results } = await userService.find({
    deletedOn: { $exists: false },
  });

  const updateFn = (user: User) => userService.atomic.updateOne(
    { _id: user._id },
    { $set: { externalId: user.email, data: { email: user.email, ...user.data } } },
  );

  await promiseUtil.promiseLimit(results, 50, updateFn);
};

export default migration;
