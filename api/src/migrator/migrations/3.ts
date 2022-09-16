import { promiseUtil } from 'utils';
import { applicationService, Env } from 'resources/application';
import { Migration } from 'migrator/types';

const migration = new Migration(3, 'Add env data to applications');

migration.migrate = async () => {
  const applicationIds = await applicationService.distinct('_id', {});

  const updateFn = (applicationId: string) => applicationService.atomic.updateOne(
    { _id: applicationId },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { $set: { envs: {
      [Env.DEVELOPMENT]: {
        totalUsersCount: 0,
      },
      [Env.STAGING]: {
        totalUsersCount: 0,
      },
      [Env.PRODUCTION]: {
        totalUsersCount: 0,
      },
    } } },
  );

  await promiseUtil.promiseLimit(applicationIds, 50, updateFn);
};

export default migration;
