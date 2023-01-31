import sequenceService from 'resources/sequence/sequence.service';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import scheduledJobService from 'resources/scheduled-job/scheduled-job.service';

import pipelineUserService from './pipeline-user.service';
import { PipelineUser } from './pipeline-user.types';

export const updatePipelinesForUser = async (user: PipelineUser, pipelinesArray: { _id: string, name: string }[]) => {

  const pipelinesToRemove = user.pipelines.filter((up) => !pipelinesArray.find((pl) => pl._id === up._id ));
  for (const pl of pipelinesToRemove) {

    const { results: sequences } = await sequenceService.find({ pipelineId: pl._id });

    await pipelineUserService.atomic.updateOne(
      { _id: user._id,
        'sequences._id': { $in: sequences.map((s) => s._id) } },
      {
        $set: {
          'sequences.$.finishedOn': new Date(),
        },
        $pull: {
          pipelines: { _id: pl._id },
        },
      },
    );
  }

  const pipelinesToAdd = pipelinesArray.filter((p) => !user.pipelines.find((pl) => pl._id === p._id ));
  for (const pl of pipelinesToAdd) {
    const { results: [sequence] } = await sequenceService.find(
      { pipelineId: pl._id, enabled: true },
      { sort: { index: -1 }, limit: 1 },
    );

    const { results: [sequenceEmail] } = await sequenceEmailService.find({
      sequenceId: sequence._id,
      enabled: true,
      deletedOn: { $exists: false },
    }, { sort: { index: -1 }, limit: 1 });

    await pipelineUserService.atomic.updateOne({ _id: user._id }, { $addToSet: {
      pipelines: { _id: pl._id, name: pl.name },
      sequences: {
        _id: sequence._id,
        name: sequence.name,
        pipelineId: sequence.pipelineId,
        pendingEmail: sequenceEmail._id,
      },
    } });

    await scheduledJobService.scheduleSequenceEmail(sequenceEmail, user.email);
  }
};
