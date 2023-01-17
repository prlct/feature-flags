import db from 'db';
import moment from 'moment';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './emails-sending-analytics.schema';
import { EmailsSendingAnalytics } from './emails-sending-analytics.types';
import companyService from 'resources/company/company.service';

interface CreateEmailsSendingAnalytics {
  applicationId: string;
}

const service = db.createService<EmailsSendingAnalytics>(DATABASE_DOCUMENTS.EMAILS_SENDING_ANALYTICS, { schema });
service.createIndex({ expirationOn: 1 }, { expireAfterSeconds: 3600 });

const createEmailsSendingAnalytics = async ({ applicationId }: CreateEmailsSendingAnalytics) => {
  const today = moment().format('YYYY/MM/DD');

  const company = await companyService.findOne({
    applicationIds: { $elemMatch: { $eq: applicationId } },
    deletedOn: { $exists: false },
  });

  const emailsSendingAnalytics = await service.findOne({
    companyId: company?._id,
    [`sendingEmails.${today}`]: { $exists: true },
  });

  if (!emailsSendingAnalytics) {
    const ANALYTICS_EXPIRATION_TIME_IN_DAYS = 31;
    
    const expirationOn = moment().add(ANALYTICS_EXPIRATION_TIME_IN_DAYS, 'd').toDate();
    await service.insertOne({
      companyId: company?._id,
      sendingEmails: { [today]: 1 },
      adminId: company?.adminIds[0],
      expirationOn,
    });
    return;
  }

  await service.atomic.updateOne(
    { companyId: company?._id, 
      [`sendingEmails.${today}`]: { $exists: true },
    },
    { $inc: { [`sendingEmails.${today}`]: 1 } },
  );
};

export default Object.assign(service, {
  createEmailsSendingAnalytics,
});
