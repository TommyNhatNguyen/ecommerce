import { orderDetailCostModelName, orderDetailDiscountModelName, orderDetailProductModelName } from "src/modules/order_detail/infras/repo/postgres/order_detail.dto";
import { orderModelName, OrderPersistence } from "src/modules/order/infras/repo/postgres/dto";
import { orderDetailModelName } from "src/modules/order_detail/infras/repo/postgres/order_detail.dto";
import { OrderDetailPersistence } from "src/modules/order_detail/infras/repo/postgres/order_detail.dto";
import { paymentModelName, PaymentPersistence } from "src/modules/payment/infras/repo/postgres/payment.dto";

import { productCategoryModelName, productDiscountModelName, productImageModelName, productModelName, productVariantModelName } from "src/modules/products/infras/repo/postgres/dto";
import { paymentMethodModelName, PaymentMethodPersistence } from "src/modules/payment_method/infras/postgres/repo/payment_method.dto";
import { ProductPersistence } from "src/modules/products/infras/repo/postgres/dto";
import { costModelName, CostPersistence } from "src/modules/cost/infras/repo/postgres/cost.dto";
import { DiscountPersistence } from "src/modules/discount/infras/repo/postgres/discount.dto";
import { discountModelName } from "src/modules/discount/infras/repo/postgres/discount.dto";
import { shippingModelName, ShippingPersistence } from "src/modules/shipping/infras/postgres/repo/shipping.dto";
import { cartProductModelName } from "src/modules/cart/infras/repo/postgres/cart.dto";
import { cartModelName } from "src/modules/cart/infras/repo/postgres/cart.dto";
import { customerModelName, CustomerPersistence } from "src/modules/customer/infras/repo/postgres/customer.dto";
import { CartPersistence } from "src/modules/cart/infras/repo/postgres/cart.dto";
import { categoryModelName, CategoryPersistence } from "src/infras/repository/category/dto";
import { variantModelName } from "src/modules/variant/infras/repo/postgres/dto";
import { VariantPersistence } from "src/modules/variant/infras/repo/postgres/dto";
import { reviewModelName } from "src/infras/repository/review/dto";
import { ImagePersistence } from "src/infras/repository/image/dto";
import { imageModelName } from "src/infras/repository/image/dto";
import { ReviewPersistence } from "src/infras/repository/review/dto";
import { InventoryPersistence } from "src/modules/inventory/infras/repo/postgres/dto";
import { userModelName, UserPersistence } from "src/infras/repository/user/dto";
import { permissionModelName, PermissionPersistence } from "src/infras/repository/permission/dto";
import { roleModelName, RolePersistence } from "src/infras/repository/role/dto";
import { permissionRoleModelName } from "src/infras/repository/permission/dto";
import { messageModelName, MessagePersistence } from "src/modules/messages/infras/repo/postgres/dto";
import { entityModelName } from "src/modules/messages/entity/infras/postgres/dto";
import { EntityPersistence } from "src/modules/messages/entity/infras/postgres/dto";
import { actorModelName, ActorPersistence } from "src/modules/messages/actor/infras/postgres/dto";

export const initializeAssociation = () => {
  
MessagePersistence.belongsTo(ActorPersistence, {
  foreignKey: 'actor_id',
  as: actorModelName.toLowerCase(),
});

ActorPersistence.hasOne(MessagePersistence, {
  foreignKey: 'actor_id',
  as: messageModelName.toLowerCase(),
});

MessagePersistence.belongsTo(EntityPersistence, {
  foreignKey: 'entity_id',
  as: entityModelName.toLowerCase(),
});

EntityPersistence.hasOne(MessagePersistence, {
  foreignKey: 'entity_id',
  as: messageModelName.toLowerCase(),
});

PaymentMethodPersistence.hasOne(PaymentPersistence, {
  foreignKey: 'id',
  as: paymentModelName.toLowerCase(),
});

PaymentPersistence.belongsTo(PaymentMethodPersistence, {
  foreignKey: 'payment_method_id',
  as: paymentMethodModelName.toLowerCase(),
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

OrderDetailPersistence.belongsToMany(DiscountPersistence, {
  through: orderDetailDiscountModelName,
  foreignKey: 'order_detail_id',
  otherKey: 'discount_id',
  as: discountModelName.toLowerCase(),
});

DiscountPersistence.belongsToMany(OrderDetailPersistence, {
  through: orderDetailDiscountModelName,
  foreignKey: 'discount_id',
  otherKey: 'order_detail_id',
  as: orderDetailModelName.toLowerCase(),
});

PaymentPersistence.hasOne(OrderDetailPersistence, {
  foreignKey: 'payment_id',
  as: orderDetailModelName.toLowerCase(),
});

OrderDetailPersistence.belongsTo(PaymentPersistence, {
  foreignKey: 'payment_id',
  as: paymentModelName.toLowerCase(),
});

OrderDetailPersistence.belongsTo(ShippingPersistence, {
  foreignKey: 'shipping_method_id',
  as: shippingModelName.toLowerCase(),
});

ShippingPersistence.hasOne(OrderDetailPersistence, {
  foreignKey: 'shipping_method_id',
  as: orderDetailModelName.toLowerCase(),
});

CartPersistence.hasOne(CustomerPersistence, {
  foreignKey: 'cart_id',
  as: customerModelName.toLowerCase(),
  onDelete: 'RESTRICT',
});

CustomerPersistence.belongsTo(CartPersistence, {
  foreignKey: 'cart_id',
  as: cartModelName.toLowerCase(),
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

CartPersistence.belongsToMany(ProductPersistence, {
  through: cartProductModelName,
  foreignKey: 'cart_id',
  otherKey: 'product_id',
  as: productModelName.toLowerCase(),
});

ProductPersistence.belongsToMany(CartPersistence, {
  through: cartProductModelName,
  foreignKey: 'product_id',
  otherKey: 'cart_id',
  as: cartModelName.toLowerCase(),
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

ReviewPersistence.belongsTo(CustomerPersistence, {
  foreignKey: 'customer_id',
  as: customerModelName.toLowerCase(),
});

CustomerPersistence.hasOne(ReviewPersistence, {
  foreignKey: 'customer_id',
  as: reviewModelName.toLowerCase(),
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
};
