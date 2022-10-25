import _ from 'lodash';

import { AppKoaContext, Next } from 'types';
import { featureService } from 'resources/feature';

const saveChangesMiddleware = async (ctx: AppKoaContext, next: Next) => {
  if (ctx.state.featureChanges) {
    const { featureChanges } = ctx.state;
    const changes = {
      ...featureChanges,
      admin: _.pick(ctx.state.admin, ['_id', 'email']),
      changedOn: new Date(),
    };

    featureService.atomic.updateOne({ _id: featureChanges.featureId }, {
      $push: { changeHistory: changes },
    });
  }

  return next();
};

export default saveChangesMiddleware;
