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
  emailList: Joi.array().required(),
});

const emailSchema = Joi.string().email().required();

type ValidatedListItem = {
  [key: string]: string,
};

type ValidatedData = {
  sequenceId: string,
  emailList: ValidatedListItem[],
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceId, emailList } = ctx.validatedData;
  const { applicationId } = ctx.params;

  const sequence = await sequenceService.findOne({ _id: sequenceId, applicationId, deletedOn: { $exists: false } });

  if (!sequence) {
    ctx.throw(400, 'Sequence not found');
    return;
  }

  const pipeline = await pipelineService.findOne({
    _id: sequence.pipelineId,
    applicationId,
    deletedOn: { $exists: false },
  });

  if (!pipeline) {
    ctx.throw(400, 'Pipeline not found');
    return;
  }

  const emailHeader = Object.keys(emailList[0]).find((key) => key.toLocaleLowerCase().includes('email'));

  const emailArray = emailList.map((email) => 
    emailHeader ? email[emailHeader] : Object.values(email)[0]);

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

  const newUserEmails = emailArray.filter((item) => {
    if (!existingUsers) {
      return !emailSchema.validate(item).error;
    }
    if (!existingUsers.emails.includes(item)) {
      return !emailSchema.validate(item).error;
    }
    return false;
  });

  if (!newUserEmails.length) {
    ctx.throw(400, 'Users already in an active pipeline');
  }

  const { results } = await sequenceEmailService.find({ sequenceId, deletedOn: { $exists: false }, enabled: true });

  const newUserList = newUserEmails.map((item) => ({
    email: item,
    applicationId,
    pipeline: {
      _id: pipeline._id,
      name: pipeline.name,
    },
    sequence: {
      _id: sequence._id,
      name: sequence.name,
      lastEmailId: null,
      pendingEmailId: results?.[0]?._id,
    }, 
  }));

  const createdUser = await pipelineUserService.insertMany(newUserList);

  for (const userEmail of newUserEmails) {
    await scheduledJobService.scheduleSequenceEmail(results[0], userEmail);
  }

  ctx.body = createdUser;
};


export default (router: AppRouter) => {
  router.post('/:applicationId/pipeline-users-list', applicationAuth, validateMiddleware(schema), handler);
};
