
import { AppKoaContext, AppRouter } from 'types';

const handler = async (ctx: AppKoaContext) => {

};

export default (router: AppRouter) => {
  router.get('/add-gmail', handler);
};
