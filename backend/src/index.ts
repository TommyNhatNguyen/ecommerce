var cors = require('cors');
import express from 'express';
import { config } from 'dotenv';
import path from 'path';
import { sequelize } from 'src/share/sequelize';
import { setupProductRouter } from 'src/modules/products';
import setupCategoryRouter from 'src/routers/category';
import {
  categoryModelName,
  CategoryPersistence,
} from 'src/infras/repository/category/dto';
import {
  productCategoryModelName,
  productDiscountModelName,
  productImageModelName,
  productModelName,
  ProductPersistence,
  productVariantModelName,
} from 'src/modules/products/infras/repo/postgres/dto';
import { setupDiscountRouter } from 'src/modules/discount';
import {
  variantModelName,
  VariantPersistence,
} from 'src/modules/variant/infras/repo/postgres/dto';
import { setupImageRouter } from 'src/routers/image';
import {
  imageModelName,
  ImagePersistence,
} from 'src/infras/repository/image/dto';
import { setupInventoryRouter } from 'src/modules/inventory';
import {
  inventoryModelName,
  InventoryPersistence,
} from 'src/modules/inventory/infras/repo/postgres/dto';
import { reviewModelName } from 'src/infras/repository/review/dto';
import { setupReviewRouter } from 'src/routers/review';
import { ReviewPersistence } from 'src/infras/repository/review/dto';
import {
  orderModelName,
  OrderPersistence,
} from 'src/modules/order/infras/repo/postgres/dto';
import { setupOrderRouter } from 'src/modules/order';
import { setupCustomerRouter } from 'src/modules/customer';
import { setupShippingRouter } from 'src/modules/shipping';
import { setupUserRouter } from 'src/routers/user';
import { setupRoleRouter } from 'src/routers/role';
import { userModelName, UserPersistence } from 'src/infras/repository/user/dto';
import { roleModelName, RolePersistence } from 'src/infras/repository/role/dto';
import { setupPermissionRouter } from 'src/routers/permission';
import {
  permissionModelName,
  PermissionPersistence,
  permissionRoleModelName,
} from 'src/infras/repository/permission/dto';
import { setupOrderDetailRouter } from 'src/modules/order_detail';
import {
  orderDetailCostModelName,
  orderDetailDiscountModelName,
  OrderDetailPersistence,
  orderDetailProductModelName,
  PostgresOrderDetailProductPersistence,
} from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import { orderDetailModelName } from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import { setupCartRouter } from 'src/modules/cart';
import { setupPaymentRouter } from 'src/modules/payment';
import { paymentModelName } from 'src/modules/payment/infras/repo/postgres/payment.dto';
import { PaymentPersistence } from 'src/modules/payment/infras/repo/postgres/payment.dto';
import {
  customerModelName,
  CustomerPersistence,
} from 'src/modules/customer/infras/repo/postgres/customer.dto';
import {
  cartModelName,
  cartProductModelName,
} from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { CartPersistence } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { DiscountPersistence } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { setupCostRouter } from 'src/modules/cost';
import { setupPaymentMethodRouter } from 'src/modules/payment_method';
import {
  paymentMethodModelName,
  PaymentMethodPersistence,
} from 'src/modules/payment_method/infras/postgres/repo/payment_method.dto';
import {
  costModelName,
  CostPersistence,
} from 'src/modules/cost/infras/repo/postgres/cost.dto';
import {
  shippingModelName,
  ShippingPersistence,
} from 'src/modules/shipping/infras/postgres/repo/shipping.dto';
import { setupVariantRouter } from 'src/modules/variant';
import { Server } from 'socket.io';
import { initializeAssociation } from 'src/share/helpers/initialize-association';
import { createServer } from 'http';
import Websocket from 'src/share/modules/websocket';
import { setupNotification } from 'src/modules/notification';
import { setupActorRouter } from 'src/modules/messages/actor';
import { setupEntityRouter } from 'src/modules/messages/entity';
import { setupMessageRouter } from 'src/modules/messages';
import { instrument } from '@socket.io/admin-ui';
config();

(async () => {
  try {
    // await sequelize.drop();
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const app = express();
const port = process.env.PORT || 3000;
const socketApp = express();
const socketPort = process.env.SOCKET_PORT || 3003;
const server = createServer(socketApp);
const io = Websocket.getInstance(server);
instrument(io, {
  auth: false,
  mode: 'development',
});
app.use(
  express.json({
    limit: '50mb',
  })
);
app.use(cors());

setupNotification(io, sequelize);
app.use('/v1', setupProductRouter(sequelize));
app.use('/v1', setupCategoryRouter(sequelize));
app.use('/v1', setupDiscountRouter(sequelize));
app.use('/v1', setupVariantRouter(sequelize));
app.use('/v1', setupImageRouter(sequelize));
app.use('/v1', setupInventoryRouter(sequelize));
app.use('/v1', setupReviewRouter(sequelize));
app.use('/v1', setupOrderRouter(sequelize));
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
initializeAssociation();

io.engine.on('connection_error', (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

server.listen(socketPort, () => {
  console.log(`Socket server is running on: http://localhost:${socketPort}`);
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
