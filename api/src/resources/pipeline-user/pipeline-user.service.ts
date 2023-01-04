import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import sequenceService from 'resources/sequence/sequence.service';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';

import schema from './pipeline-user.schema';
import { PipelineUser } from './pipeline-user.types';
import { Pipeline } from '../pipeline';
import scheduledJobService from '../scheduled-job/scheduled-job.service';

const service = db.createService<PipelineUser>(DATABASE_DOCUMENTS.PIPELINE_USERS, { schema });

const addToPipeline = async (pipeline: Pipeline, user: PipelineUser) => {
  const existingPipeline = user.pipelines.find((p) => p._id === pipeline._id);

  if (existingPipeline) {
    return;
  }

  const existingSequence = user.sequences.find((s) => s.pipelineId === pipeline._id);

  if (existingSequence && !existingSequence.finishedOn) {
    return;
  }

  const { results: [sequenceToStart] } = await sequenceService.find({
    pipelineId: pipeline._id,
    enabled: true,
    deletedOn: { $exists: false },
  }, { sort: { index: -1 }, limit: 1 });

  const { results: [firstEmail] } = await sequenceEmailService.find({
    sequenceId: sequenceToStart._id,
    deletedOn: { $exists: false },
    enabled: true,
  }, {
    sort: {  index: -1 },
    limit: 1,
  });

  await service.atomic.updateOne({ _id: user._id }, {
    $addToSet: {
      pipelines: { _id: pipeline._id, name: pipeline.name },
      sequences: {
        _id: sequenceToStart._id,
        name: sequenceToStart.name,
        pendingEmail: firstEmail._id,
        pipelineId: pipeline._id,
      },
    },
  });

  await scheduledJobService.scheduleSequenceEmail(firstEmail, user.email);
};

export default Object.assign(service, { addToPipeline });
