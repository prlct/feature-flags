import { Migration } from 'migrator/types';
import { adminService } from 'resources/admin';

const migration = new Migration(10, 'Add currentCompany & currentApplication to admins');

migration.migrate = async () => {
  const adminsToUpdate = await adminService.aggregate([
    {
      $match: {},
    },
    {
      $lookup: {
        from: 'companies',
        let: { 'companyId': { $arrayElemAt: ['$companyIds', 0] } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$companyId'],
              },
            },
          },
        ],
        as: 'company',
      },
    },
    {
      $unwind:
        {
          path: '$company',
          preserveNullAndEmptyArrays: false,
        },
    },
  ]);

  const adminUpdates = adminsToUpdate.map((adminWithCompany) => ({
    updateOne: {
      filter: { _id: adminWithCompany._id },
      update: {
        $set: {
          currentCompany: {
            _id: adminWithCompany.company._id,
            name: adminWithCompany.company.name,
          },
        },
      },
      upsert: false,
    },
  }));

  await adminService.atomic.bulkWrite(adminUpdates);
};

export default migration;
