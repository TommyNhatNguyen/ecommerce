import { workerData } from 'worker_threads';
import { Sequelize } from 'sequelize';
import { productSellableCronJobInit } from '../schedulers';

// Initialize Sequelize inside the worker
const sequelize = new Sequelize(workerData.databaseConfig);
console.log('🚀 ~ workerData.databaseConfig:', workerData.databaseConfig);
console.log('🚀 ~ workerData.databaseConfig:', sequelize.models);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Worker: Database connected successfully.');

    // Sync database (optional, only if necessary)
    await sequelize.sync({ alter: true });

    // Start cron jobs
    console.log('Worker: Starting cron jobs... at ' + new Date().toISOString());
    const productSellableCronJob = productSellableCronJobInit(sequelize);
    productSellableCronJob.start();
  } catch (error) {
    console.error('Worker: Database connection failed:', error);
  }
})();
