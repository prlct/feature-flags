import { AppKoaContext, AppRouter } from 'types';
import Joi from 'joi';

import { validateMiddleware } from 'middlewares';

import sequenceService from 'resources/sequence/sequence.service';
import pipelineService from 'resources/pipeline/pipeline.service';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import scheduledJobService from 'resources/scheduled-job/scheduled-job.service';

import applicationAuth from '../middlewares/application-auth.middleware';

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

  const emailArray = usersList.map((user) => user.email);

  const [ existingUsers ] = await pipelineUserService.aggregate([
    {
      $match: {
        'email': { $in: emailArray },
        applicationId,
        'pipeline._id': pipeline._id,
        'sequence._id': sequence._id,
        finished: false,
        deletedOn: { $exists: false },
      },
    },
    { $group: {
      _id: null,
      emails: {
        $push: '$email',
      },
    },
    },
    { $project: {
      _id: 0,
      emails: 1,
    },
    },
  ]);

  const newUsers = existingUsers ? usersList.filter((item) => !existingUsers.emails.includes(item.email)) : usersList;

  if (!newUsers.length) {
    ctx.throwClientError({ usersList: 'Users already in an active pipeline' });
  }

  const { results: [firstEmail] } = await sequenceEmailService.find({
    sequenceId,
    deletedOn: { $exists: false },
    enabled: true,
  }, {
    sort: {  index: -1 },
    limit: 1,
  });

  const newUserList = newUsers.map((item) => ({
    email: item.email,
    firstName: item.firstName,
    lastName: item.lastName,
    applicationId,
    pipeline: {
      _id: pipeline._id,
      name: pipeline.name,
    },
    sequence: {
      _id: sequence._id,
      name: sequence.name,
      lastEmailId: null,
      pendingEmailId: firstEmail?._id,
    },
  }));

  const createdUser = await pipelineUserService.insertMany(newUserList);

  const extraDelayMillis = 100;
  for (const [i, user] of Object.entries(newUserList)) {
    await scheduledJobService.scheduleSequenceEmail(firstEmail, user.email, +i * extraDelayMillis);
  }

  ctx.body = createdUser;
};


export default (router: AppRouter) => {
  router.post('/:applicationId/pipeline-users-list', applicationAuth, validateMiddleware(schema), handler);
};
