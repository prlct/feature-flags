import { Migration } from 'migrator/types';
import { adminService } from 'resources/admin';
import { companyService } from 'resources/company';

const migration = new Migration(9, 'Add currentCompany & currentApplication to admins');

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

  const [adminUpdates, companyUpdates] = adminsToUpdate.reduce((acc, adminWithCompany) => {
    return [[...acc[0], {
      updateOne: {
        filter: { _id: adminWithCompany._id, companies: { $exists: false } },
        update: {
          $set: {
            currentCompany: {
              _id: adminWithCompany.company._id,
              name: adminWithCompany.company.name,
            },
            companies: [
              {
                _id: adminWithCompany.company._id,
                name: adminWithCompany.company.name,
              },
            ],
            currentApplicationId: adminWithCompany.applicationIds[0],
          },
        },
        upsert: false,
      },
    }], [...acc[1], {
      updateOne: {
        filter: { _id: adminWithCompany.ownCompanyId },
        update: {
          $set: {
            name: adminWithCompany.email,
          },
        },
        upsert: false,
      },
    }]];
  }, [[], []]);

  await adminService.atomic.bulkWrite(adminUpdates);
  await companyService.atomic.bulkWrite(companyUpdates);
};

export default migration;
