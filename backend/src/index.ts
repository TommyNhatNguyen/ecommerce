import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import path from "path";
import { sequelize } from "src/share/sequelize";
import { setupProductRouter } from "src/modules/products";
import setupCategoryRouter from "src/routers/category";
import { setupDiscountRouter } from "src/modules/discount";
import { setupImageRouter } from "src/routers/image";
import { setupInventoryRouter } from "src/modules/inventory";
import { setupReviewRouter } from "src/routers/review";
import { setupOrderRouter } from "src/modules/order";
import { setupCustomerRouter } from "src/modules/customer";
import { setupShippingRouter } from "src/modules/shipping";
import { setupUserRouter } from "src/modules/user";
import { setupRoleRouter } from "src/modules/role";
import { setupPermissionRouter } from "src/modules/permission";
import { setupOrderDetailRouter } from "src/modules/order_detail";
import { setupCartRouter } from "src/modules/cart";
import { setupPaymentRouter } from "src/modules/payment";
import { setupCostRouter } from "src/modules/cost";
import { setupPaymentMethodRouter } from "src/modules/payment_method";
import { setupVariantRouter } from "src/modules/variant";
import { initializeAssociation } from "src/share/helpers/initialize-association";
import { createServer } from "http";
import Websocket from "src/share/modules/websocket";
import { setupNotification } from "src/modules/notification";
import { setupActorRouter } from "src/modules/messages/actor";
import { setupEntityRouter } from "src/modules/messages/entity";
import { setupMessageRouter } from "src/modules/messages";
import { instrument } from "@socket.io/admin-ui";
import { errorHandler } from "./share/helpers/error-handler";
import { setupOptionRouter, setupOptionValueRouter } from "src/modules/options";
import { setupProductSellableRouter } from "src/modules/product_sellable";

config();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
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
  mode: "development",
});

app.use(express.json({ limit: "50mb" }));
app.use(cors());

setupNotification(io, sequelize);
app.use("/v1", setupProductRouter(sequelize));
app.use("/v1", setupCategoryRouter(sequelize));
app.use("/v1", setupDiscountRouter(sequelize));
app.use("/v1", setupVariantRouter(sequelize));
app.use("/v1", setupImageRouter(sequelize));
app.use("/v1", setupInventoryRouter(sequelize));
app.use("/v1", setupReviewRouter(sequelize));
app.use("/v1", setupOrderRouter(sequelize));
app.use("/v1", setupCustomerRouter(sequelize));
app.use("/v1", setupShippingRouter(sequelize));
app.use("/v1", setupPaymentRouter(sequelize));
app.use("/v1", setupUserRouter(sequelize));
app.use("/v1", setupRoleRouter(sequelize));
app.use("/v1", setupPermissionRouter(sequelize));
app.use("/v1", setupActorRouter(sequelize));
app.use("/v1", setupEntityRouter(sequelize));
app.use("/v1", setupMessageRouter(sequelize));
app.use("/v1", setupOrderDetailRouter(sequelize));
app.use("/v1", setupCartRouter(sequelize));
app.use("/v1", setupCostRouter(sequelize));
app.use("/v1", setupPaymentMethodRouter(sequelize));
app.use("/v1", setupOptionRouter(sequelize));
app.use("/v1", setupOptionValueRouter(sequelize));
app.use("/v1", setupProductSellableRouter(sequelize));
// app.use('/v1', setupResourcesRouter(sequelize));

initializeAssociation();
app.use(errorHandler);

io.engine.on("connection_error", (err) => {
  console.log(err.req);
  console.log(err.code);
  console.log(err.message);
  console.log(err.context);
});

server.listen(socketPort, () => {
  console.log(`Socket server is running on: http://localhost:${socketPort}`);
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
