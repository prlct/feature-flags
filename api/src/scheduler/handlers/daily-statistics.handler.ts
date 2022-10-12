import cron from 'scheduler/cron';

import { statisticsHelper } from 'resources/statistics';

cron.on('cron:every-day', async () => {  
  statisticsHelper.calculcateMonthlyStatisctics();
});
