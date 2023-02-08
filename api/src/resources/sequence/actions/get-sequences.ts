import Joi from 'joi';

import sequenceService from 'resources/sequence/sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import pipelineAccess from 'resources/pipeline/middlewares/pipeline-access';
import { validateMiddleware } from 'middlewares';
import { DATABASE_DOCUMENTS } from '../../../app.constants';

const schema = Joi.object({
  pipelineId: Joi.string().trim().required(),
});

type ValidatedData = {
  pipelineId: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { pipelineId } = ctx.validatedData;

  const sequences = await sequenceService.aggregate([
    { $match: { pipelineId,  deletedOn: { $exists: false } } },
    { $lookup: {
      from: DATABASE_DOCUMENTS.PIPELINE_USERS,
      localField: '_id',
      foreignField: 'sequences._id',
      as: 'users',
    } },
    {
      $addFields: {
        total: {
          $size: '$users',
        },
      },
    },
    {
      $unset: 'users',
    },
  ]);

  ctx.body = sequences;
};

export default (router: AppRouter) => {
  router.get('/', pipelineAccess, validateMiddleware(schema), handler);
};
