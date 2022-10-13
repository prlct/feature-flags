import moment from 'moment';
import logger from 'logger';

import { userService } from 'resources/user';
import statisticsService from './statistics.service';

export const calculateMonthlyStatistics = async () => {
  try {
    const startOfMonth = moment().startOf('month').toDate();
    const currentDate = new Date();

    const statistics = await userService.aggregate([
      {
        $match: {
          $and: [
            { lastVisitedOn: { $gte: startOfMonth } },
            { lastVisitedOn: { $lte: currentDate } },
          ],
        },
      },
      {
        $group: {
          _id: '$applicationId',
          count: { $sum: 1 },
        },
      },
    ]);

    const bulk = statistics.map((item) => ({
      updateOne: {
        filter: {
          applicationId: item._id,
          createdOn: { $gte: startOfMonth },
        },
        update: {
          $set: {
            applicationId: item._id,
            mau: item.count,
            createdOn: startOfMonth,
            updatedOn: currentDate,
          },
        },
        upsert: true,
      },
    }));

    await statisticsService.atomic.bulkWrite(bulk);
  } catch (error) {
    logger.error('Statistics calculation cron job failed: ', error);
  }
};
