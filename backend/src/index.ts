import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import { sequelize } from 'src/share/sequelize';
import { setupProductRouter } from 'src/modules/products';
import setupCategoryRouter from 'src/modules/category';
import { setupDiscountRouter } from 'src/modules/discount';
import { setupImageRouter } from 'src/modules/image';
import { setupInventoryRouter } from 'src/modules/inventory';
import { setupReviewRouter } from 'src/modules/review';
import { setupOrderRouter } from 'src/modules/order';
import { setupCustomerRouter } from 'src/modules/customer';
import { setupShippingRouter } from 'src/modules/shipping';
import { setupUserRouter } from 'src/modules/user';
import { setupRoleRouter } from 'src/modules/role';
import { setupPermissionRouter } from 'src/modules/permission';
import { setupOrderDetailRouter } from 'src/modules/order_detail';
import { setupCartRouter } from 'src/modules/cart';
import { setupPaymentRouter } from 'src/modules/payment';
import { setupCostRouter } from 'src/modules/cost';
import { setupPaymentMethodRouter } from 'src/modules/payment_method';
import { setupVariantRouter } from 'src/modules/variant';
import { initializeAssociation } from 'src/share/helpers/initialize-association';
import { createServer } from 'http';
import Websocket from 'src/socket/infras/repo';
import { setupActorRouter } from 'src/modules/messages/actor';
import { setupEntityRouter } from 'src/modules/messages/entity';
import { setupMessageRouter } from 'src/modules/messages';
import { instrument } from '@socket.io/admin-ui';
import { errorHandler } from './share/helpers/error-handler';
import { setupOptionRouter, setupOptionValueRouter } from 'src/modules/options';
import { setupProductSellableRouter } from 'src/modules/product_sellable';
import {
  inventoryLowStockCronJobInit,
  productSellableCronJobInit,
} from 'src/schedulers';
import amqp from 'amqplib/callback_api';
import { setupBlogsRouter } from 'src/modules/blogs';
import { Connection } from 'amqplib';
import { QueueTypes } from 'src/brokers/transport/queueTypes';
import Publisher from 'src/brokers/infras/publisher';
import Consumer from 'src/brokers/infras/consumer';
import RabbitMQ from 'src/brokers/infras/dto';
import { SOCKET_NAMESPACE } from 'src/socket/models/socket-endpoint';
import {
  chatNameSpaceSocketSetup,
  inventoryNameSpaceSocketSetup,
} from 'src/socket/socketManager';
import { orderNameSpaceSocketSetup } from 'src/socket/socketManager';
import { connectMongoDB } from 'src/share/mongoose';
import { setupChat } from 'src/modules/chat';
import { setupCouponRouter } from 'src/modules/coupon';
import setupBrandRouter from 'src/modules/brand';
// ENVIRONMENT CONFIGURATION
config();

// DATABASE CONNECTION CHECK
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// MONGO DATABASE CONNECTION CHECK
connectMongoDB();

// EXPRESS AND SOCKET.IO SETUP
const app = express();
const port = process.env.PORT || 3000;
const socketApp = express();
const socketPort = process.env.SOCKET_PORT || 3003;
const server = createServer(socketApp);
const io = Websocket.getInstance(server);

// SOCKET.IO ADMIN UI CONFIGURATION
instrument(io, {
  auth: false,
  mode: 'development',
});

// MIDDLEWARE SETUP
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// RABBITMQ SETUP
const rabbitMQ = new RabbitMQ();
const orderAlertPublisher = new Publisher(rabbitMQ);
const orderAlertConsumer = new Consumer(rabbitMQ);
const inventoryAlertPublisher = new Publisher(rabbitMQ);
const inventoryAlertConsumer = new Consumer(rabbitMQ);
// SOCKET SETUP
const orderSocketUseCase = orderNameSpaceSocketSetup(io);
const inventorySocketUseCase = inventoryNameSpaceSocketSetup(io);
const chatSocketUseCase = chatNameSpaceSocketSetup(io, sequelize);
inventoryAlertConsumer.consumeMessages(
  QueueTypes.INVENTORY_ALERT,
  (message) => {
    inventorySocketUseCase.emit(
      SOCKET_NAMESPACE.INVENTORY.endpoints.LOW_INVENTORY,
      JSON.stringify(message)
    );
  }
);
orderAlertConsumer.consumeMessages(QueueTypes.ORDER_NOTIFICATION, (message) => {
  orderSocketUseCase.emit(
    SOCKET_NAMESPACE.ORDER.endpoints.ORDER_CREATED,
    JSON.stringify(message)
  );
});
console.log('rabbitMQ.getChannels()', rabbitMQ.getChannels());
// API ROUTES SETUP
// setupNotification(io, sequelize);
app.use('/v1', setupProductRouter(sequelize));
app.use('/v1', setupCategoryRouter(sequelize));
app.use('/v1', setupDiscountRouter(sequelize));
app.use('/v1', setupVariantRouter(sequelize));
app.use('/v1', setupImageRouter(sequelize));
app.use('/v1', setupInventoryRouter(sequelize));
app.use('/v1', setupReviewRouter(sequelize));
app.use('/v1', setupOrderRouter(sequelize, orderAlertPublisher));
app.use('/v1', setupCustomerRouter(sequelize));
app.use('/v1', setupShippingRouter(sequelize));
app.use('/v1', setupPaymentRouter(sequelize));
app.use('/v1', setupUserRouter(sequelize));
app.use('/v1', setupRoleRouter(sequelize));
app.use('/v1', setupPermissionRouter(sequelize));
app.use('/v1', setupActorRouter(sequelize));
app.use('/v1', setupEntityRouter(sequelize));
app.use('/v1', setupMessageRouter(sequelize));
app.use('/v1', setupOrderDetailRouter(sequelize));
app.use('/v1', setupCartRouter(sequelize));
app.use('/v1', setupCostRouter(sequelize));
app.use('/v1', setupPaymentMethodRouter(sequelize));
app.use('/v1', setupOptionRouter(sequelize));
app.use('/v1', setupOptionValueRouter(sequelize));
app.use('/v1', setupProductSellableRouter(sequelize));
app.use('/v1', setupBlogsRouter(sequelize));
app.use('/v1', setupCouponRouter(sequelize));
app.use('/v1', setupBrandRouter(sequelize));
app.use('/v1', setupChat());
// DATABASE ASSOCIATIONS AND ERROR HANDLING
initializeAssociation();
app.use(errorHandler);

// DATABASE SYNC
(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// SOCKET ERROR HANDLING
io.engine.on('connection_error', (err) => {
  console.log(err.req);
  console.log(err.code);
  console.log(err.message);
  console.log(err.context);
});

// CRON JOBS
const productSellableCronJob = productSellableCronJobInit(sequelize);
const inventoryLowStockCronJob = inventoryLowStockCronJobInit(
  sequelize,
  inventoryAlertPublisher
);
productSellableCronJob.start();
inventoryLowStockCronJob.start();

// SERVER STARTUP
server.listen(socketPort, () => {
  console.log(`Socket server is running on: http://localhost:${socketPort}`);
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
