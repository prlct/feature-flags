import { AppKoaContext, AppRouter } from 'types';
import Joi from 'joi';
import _ from 'lodash';

import { validateMiddleware } from 'middlewares';

import sequenceService from 'resources/sequence/sequence.service';
import pipelineService from 'resources/pipeline/pipeline.service';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import scheduledJobService from 'resources/scheduled-job/scheduled-job.service';

import applicationAuth from '../middlewares/application-auth.middleware';
import { generateId } from '@paralect/node-mongo';

const schema = Joi.object({
  sequenceId: Joi.string().required(),
  usersList: Joi.array().items(Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().empty(null).allow('').default(''),
    lastName: Joi.string().empty(null).allow('').default(''),
  })).unique((a, b) => a.email === b.email),
});

type ValidatedListItem = {
  email: string,
  firstName?:string,
  lastName?: string,
};

type ValidatedData = {
  sequenceId: string,
  usersList: ValidatedListItem[],
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceId, usersList } = ctx.validatedData;
  const { applicationId } = ctx.params;

  const sequence = await sequenceService.findOne({ _id: sequenceId, applicationId, deletedOn: { $exists: false } });

  if (!sequence) {
    ctx.throwClientError({ sequence: 'Sequence not found' });
    return;
  }

  const pipeline = await pipelineService.findOne({
    _id: sequence.pipelineId,
    applicationId,
    deletedOn: { $exists: false },
  });

  if (!pipeline) {
    ctx.throwClientError({ pipeline: 'Pipeline not found' });
    return;
  }

  const { results: existingUsers } = await pipelineUserService.find(
    {
      applicationId,
      deletedOn: { $exists: false },
      'pipelines._id': pipeline._id,
      'sequences._id': sequence._id,
    },
    {
      projection: { _id: 1, email: 1 },
    },
  );

  const { results: [firstEmail] } = await sequenceEmailService.find({
    sequenceId,
    deletedOn: { $exists: false },
    enabled: true,
  }, {
    sort: { index: 1 },
    limit: 1,
  });

  const [usersToUpsert] = _.partition(usersList, (nUser) => !existingUsers.find((u) => u.email === nUser.email));

  const newUserList = usersToUpsert.map((user) => ({
    updateOne: {
      filter: {
        email: user.email,
        applicationId,
        deletedOn: { $exists: false },
      },
      update: {
        $set: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
        $setOnInsert: {
          _id: generateId(),
        },
        $addToSet: {
          pipelines: {
            _id: pipeline._id,
            name: pipeline.name,
          },
          sequences: {
            _id: sequence._id,
            name: sequence.name,
            pipelineId: pipeline._id,
            pendingEmail: firstEmail?._id,
          },
        },
      },
      upsert: true,
    },
  }));

  if (newUserList.length > 0) {
    await pipelineUserService.atomic.bulkWrite(newUserList);
    await sequenceService.atomic.updateOne({ _id: sequence._id }, { $inc: { total: 1 } });
    const extraDelayMillis = 100;
    for (const [i, user] of Object.entries(newUserList)) {
      await scheduledJobService.scheduleSequenceEmail(firstEmail, user.updateOne.filter.email, +i * extraDelayMillis);
    }
  }

  ctx.body = { usersAdded: newUserList.length };
};


export default (router: AppRouter) => {
  router.post('/:applicationId/pipeline-users-list', applicationAuth, validateMiddleware(schema), handler);
};
