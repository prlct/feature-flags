import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './sequence-email.schema';
import { SequenceEmail } from './sequence-email.types';

const service = db.createService<SequenceEmail>(DATABASE_DOCUMENTS.SEQUENCE_EMAILS, { schema });

const findNextEnabledEmail = async (email: SequenceEmail) => {
  const { results: emails } = await service.find({
    sequenceId: email.sequenceId,
    enabled: true,
    index: { $gt: email.index },
    deletedOn: { $exists: false },
  });
  return emails?.[0];
};

export default Object.assign(service, { findNextEnabledEmail });
