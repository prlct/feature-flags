import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './sequence.schema';
import { Sequence } from './sequence.types';

const service = db.createService<Sequence>(DATABASE_DOCUMENTS.SEQUENCES, { schema });

const findNextEnabledSequence = async (sequence: Sequence) => {
  const { results: sequences } = await service.find({
    applicationId: sequence.applicationId,
    enabled: true,
    index: { $gt: sequence.index },
    deletedOn: { $exists: false },
  });

  return sequences?.[0];
};

export default Object.assign(service, { findNextEnabledSequence });
