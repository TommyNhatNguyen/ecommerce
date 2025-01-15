var cors = require('cors');
import express from 'express';
import { config } from 'dotenv';
import path from 'path';
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
import { setupDiscountRouter } from 'src/modules/discount';
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
import {
  orderModelName,
  OrderPersistence,
} from 'src/infras/repository/order/dto';
import { setupOrderRouter } from 'src/routers/order';
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
  OrderDetailPersistence,
  orderDetailProductModelName,
  OrderDetailProductPersistence,
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
import { cartModelName } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { CartPersistence } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { DiscountPersistence } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { setupCostRouter } from 'src/modules/cost';
import { setupPaymentMethodRouter } from 'src/modules/payment_method';
import {
  paymentMethodModelName,
  PaymentMethodPersistence,
} from 'src/modules/payment_method/infras/postgres/repo/payment_method.dto';
import { costModelName, CostPersistence } from 'src/modules/cost/infras/repo/postgres/cost.dto';
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
app.use(
  express.json({
    limit: '50mb',
  })
);
app.use(cors());

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
app.use('/v1', setupOrderDetailRouter(sequelize));
app.use('/v1', setupCartRouter(sequelize));
app.use('/v1', setupCostRouter(sequelize));
app.use('/v1', setupPaymentMethodRouter(sequelize));

PaymentMethodPersistence.hasOne(PaymentPersistence, {
  foreignKey: 'payment_method_id',
  as: paymentMethodModelName.toLowerCase(),
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

PaymentPersistence.belongsTo(PaymentMethodPersistence, {
  foreignKey: 'id',
  as: paymentModelName.toLowerCase(),
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderDetailPersistence.hasOne(OrderPersistence, {
  foreignKey: 'order_detail_id',
  as: orderModelName.toLowerCase(),
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderPersistence.belongsTo(OrderDetailPersistence, {
  foreignKey: 'order_detail_id',
  as: orderDetailModelName.toLowerCase(),
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderDetailPersistence.belongsToMany(ProductPersistence, {
  through: orderDetailProductModelName,
  foreignKey: 'order_detail_id',
  otherKey: 'product_id',
  as: productModelName.toLowerCase(),
});

ProductPersistence.belongsToMany(OrderDetailPersistence, {
  through: orderDetailProductModelName,
  foreignKey: 'product_id',
  otherKey: 'order_detail_id',
  as: orderDetailModelName.toLowerCase(),
});

OrderDetailPersistence.belongsToMany(CostPersistence, {
  through: orderDetailCostModelName,
  foreignKey: 'order_detail_id',
  otherKey: 'cost_id',
  as: costModelName.toLowerCase(),
});

CostPersistence.belongsToMany(OrderDetailPersistence, {
  through: orderDetailCostModelName,
  foreignKey: 'cost_id',
  otherKey: 'order_detail_id',
  as: orderDetailModelName.toLowerCase(),
});

PaymentPersistence.hasOne(OrderDetailPersistence, {
  foreignKey: 'payment_id',
  as: orderDetailModelName.toLowerCase(),
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderDetailPersistence.belongsTo(PaymentPersistence, {
  foreignKey: 'payment_id',
  as: paymentModelName.toLowerCase(),
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

CartPersistence.hasOne(CustomerPersistence, {
  foreignKey: 'cart_id',
  as: customerModelName.toLowerCase(),
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

CustomerPersistence.belongsTo(CartPersistence, {
  foreignKey: 'cart_id',
  as: cartModelName.toLowerCase(),
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

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

ProductPersistence.hasMany(ReviewPersistence, {
  foreignKey: 'product_id',
  as: reviewModelName.toLowerCase(),
});

ReviewPersistence.belongsTo(ProductPersistence, {
  foreignKey: 'product_id',
  as: productModelName.toLowerCase(),
});

ProductPersistence.hasOne(InventoryPersistence, {
  foreignKey: 'product_id',
  onDelete: 'cascade',
});

InventoryPersistence.belongsTo(ProductPersistence, {
  foreignKey: 'product_id',
  onDelete: 'cascade',
});

CategoryPersistence.belongsTo(ImagePersistence, {
  foreignKey: 'image_id',
});

ImagePersistence.hasOne(CategoryPersistence, {
  foreignKey: 'image_id',
});

UserPersistence.belongsTo(RolePersistence, {
  foreignKey: 'role_id',
  as: roleModelName.toLowerCase(),
});

RolePersistence.hasOne(UserPersistence, {
  foreignKey: 'role_id',
  as: userModelName.toLowerCase(),
});

PermissionPersistence.belongsToMany(RolePersistence, {
  through: permissionRoleModelName,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: roleModelName.toLowerCase(),
});

RolePersistence.belongsToMany(PermissionPersistence, {
  through: permissionRoleModelName,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: permissionModelName.toLowerCase(),
});

console.log(path.join(__dirname, 'storage', 'images'));

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
