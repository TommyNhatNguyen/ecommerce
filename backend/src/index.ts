import express from 'express';
import { config } from 'dotenv';
import { sequelize } from 'src/share/sequelize';
import { setupProductRouter } from 'src/routers/product';
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
  productOrderModelName,
  ProductPersistence,
  productVariantModelName,
} from 'src/infras/repository/product/dto';
import { setupDiscountRouter } from 'src/routers/discount';
import {
  discountModelName,
  DiscountPersistence,
} from 'src/infras/repository/discount/dto';
import { setupVariantRouter } from 'src/routers/variant';
import {
  variantModelName,
  VariantPersistence,
} from 'src/infras/repository/variant/dto';
import { setupImageRouter } from 'src/routers/image';
import {
  imageModelName,
  ImagePersistence,
} from 'src/infras/repository/image/dto';
import { setupInventoryRouter } from 'src/routers/inventory';
import {
  inventoryModelName,
  InventoryPersistence,
} from 'src/infras/repository/inventory/dto';
import { reviewModelName } from 'src/infras/repository/review/dto';
import { setupReviewRouter } from 'src/routers/review';
import { ReviewPersistence } from 'src/infras/repository/review/dto';
import { orderModelName } from 'src/infras/repository/order/dto';
import { OrderPersistence } from 'src/infras/repository/order/dto';
import { setupOrderRouter } from 'src/routers/order';
import { setupCustomerRouter } from 'src/routers/customer';
import { customerModelName } from 'src/infras/repository/customer/dto';
import { CustomerPersistence } from 'src/infras/repository/customer/dto';
import { setupShippingRouter } from 'src/routers/shipping';
import { ShippingPersistence } from 'src/infras/repository/shipping/dto';
import { shippingModelName } from 'src/infras/repository/shipping/dto';
import { setupPaymentRouter } from 'src/routers/payment';
import {
  paymentModelName,
  PaymentPersistence,
} from 'src/infras/repository/payment/dto';
import { setupUserRouter } from 'src/routers/user';
import { setupRoleRouter } from 'src/routers/role';
import { userModelName, UserPersistence } from 'src/infras/repository/user/dto';
import { roleModelName, RolePersistence } from 'src/infras/repository/role/dto';
config();

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

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

ProductPersistence.belongsToMany(CategoryPersistence, {
  through: productCategoryModelName,
  foreignKey: 'product_id',
  otherKey: 'category_id',
  as: categoryModelName.toLowerCase(),
});

CategoryPersistence.belongsToMany(ProductPersistence, {
  through: productCategoryModelName,
  foreignKey: 'category_id',
  otherKey: 'product_id',
  as: productModelName.toLowerCase(),
});

ProductPersistence.belongsToMany(DiscountPersistence, {
  through: productDiscountModelName,
  foreignKey: 'product_id',
  otherKey: 'discount_id',
  as: discountModelName.toLowerCase(),
});

DiscountPersistence.belongsToMany(ProductPersistence, {
  through: productDiscountModelName,
  foreignKey: 'discount_id',
  otherKey: 'product_id',
  as: productModelName.toLowerCase(),
});

ProductPersistence.belongsToMany(VariantPersistence, {
  through: productVariantModelName,
  foreignKey: 'product_id',
  otherKey: 'variant_id',
  as: variantModelName.toLowerCase(),
});

VariantPersistence.belongsToMany(ProductPersistence, {
  through: productVariantModelName,
  foreignKey: 'variant_id',
  otherKey: 'product_id',
  as: productModelName.toLowerCase(),
});

ProductPersistence.belongsToMany(ImagePersistence, {
  through: productImageModelName,
  foreignKey: 'product_id',
  otherKey: 'image_id',
  as: imageModelName.toLowerCase(),
});

ImagePersistence.belongsToMany(ProductPersistence, {
  through: productImageModelName,
  foreignKey: 'image_id',
  otherKey: 'product_id',
  as: productModelName.toLowerCase(),
});

ProductPersistence.belongsToMany(OrderPersistence, {
  through: productOrderModelName,
  foreignKey: 'product_id',
  otherKey: 'order_id',
  as: orderModelName.toLowerCase(),
});

OrderPersistence.belongsToMany(ProductPersistence, {
  through: productOrderModelName,
  foreignKey: 'order_id',
  otherKey: 'product_id',
  as: productModelName.toLowerCase(),
});

ProductPersistence.hasMany(ReviewPersistence, {
  foreignKey: 'product_id',
  as: reviewModelName.toLowerCase(),
});

OrderPersistence.belongsTo(CustomerPersistence, {
  foreignKey: 'customer_id',
  as: customerModelName.toLowerCase(),
});

CustomerPersistence.hasMany(OrderPersistence, {
  foreignKey: 'customer_id',
  as: orderModelName.toLowerCase(),
});

OrderPersistence.belongsTo(ShippingPersistence, {
  foreignKey: 'shipping_method_id',
  as: shippingModelName.toLowerCase(),
});

ShippingPersistence.hasOne(OrderPersistence, {
  foreignKey: 'shipping_method_id',
  as: orderModelName.toLowerCase(),
});

OrderPersistence.belongsTo(PaymentPersistence, {
  foreignKey: 'payment_method_id',
  as: paymentModelName.toLowerCase(),
});

PaymentPersistence.hasOne(OrderPersistence, {
  foreignKey: 'payment_method_id',
  as: orderModelName.toLowerCase(),
});

ReviewPersistence.belongsTo(ProductPersistence, {
  foreignKey: 'product_id',
  as: productModelName.toLowerCase(),
});

ProductPersistence.hasOne(InventoryPersistence, {
  foreignKey: 'product_id',
});

InventoryPersistence.belongsTo(ProductPersistence, {
  foreignKey: 'product_id',
});

CategoryPersistence.belongsTo(ImagePersistence, {
  foreignKey: 'image_id',
});

ImagePersistence.hasOne(CategoryPersistence, {
  foreignKey: 'image_id',
});

UserPersistence.hasOne(RolePersistence, {
  foreignKey: 'role_id',
  as: roleModelName.toLowerCase(),
});

RolePersistence.belongsTo(UserPersistence, {
  foreignKey: 'role_id',
  as: userModelName.toLowerCase(),
});

app.listen(3001, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
