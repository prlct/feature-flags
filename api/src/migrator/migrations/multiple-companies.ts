import { Migration } from 'migrator/types';
import { adminService } from 'resources/admin';

const migration = new Migration(8, 'Add currentCompany & currentApplication to admins');

migration.migrate = async () => {
  const updatedAdmins = await adminService.updateMany({ deletedOn: { $exists: false } }, (doc) => {
    doc.currentApplicationId = doc.applicationIds[0];
    doc.currentCompany = {
      _id: doc.companyIds[0],
      name: '',
    };
    return doc;
  });
};
