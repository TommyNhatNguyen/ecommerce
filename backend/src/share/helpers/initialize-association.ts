import {
  orderDetailCostModelName,
  orderDetailDiscountModelName,
  orderDetailProductSellableHistoryModelName,
  orderDetailProductSellableModelName,
  PostgresOrderDetailProductSellablePersistence,
  ProductSellableOrderDetailModelName,
} from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import {
  orderModelName,
  OrderPersistence,
} from 'src/modules/order/infras/repo/postgres/dto';
import { orderDetailModelName } from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import { OrderDetailPersistence } from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import {
  paymentModelName,
  PaymentPersistence,
} from 'src/modules/payment/infras/repo/postgres/payment.dto';

import {
  productCategoryModelName,
  productImageModelName,
  productModelName,
} from 'src/modules/products/infras/repo/postgres/dto';
import {
  paymentMethodModelName,
  PaymentMethodPersistence,
} from 'src/modules/payment_method/infras/postgres/repo/payment_method.dto';
import { ProductPersistence } from 'src/modules/products/infras/repo/postgres/dto';
import {
  costModelName,
  CostPersistence,
} from 'src/modules/cost/infras/repo/postgres/cost.dto';
import { DiscountPersistence } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import {
  shippingModelName,
  ShippingPersistence,
} from 'src/modules/shipping/infras/postgres/repo/shipping.dto';
import { cartProductModelName } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { cartModelName } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import {
  customerModelName,
  CustomerPersistence,
} from 'src/modules/customer/infras/repo/postgres/customer.dto';
import { CartPersistence } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import {
  categoryModelName,
  CategoryPersistence,
} from 'src/modules/category/infras/repo/dto';
import {
  // variantImageModelName,
  variantModelName,
  variantOptionValueModelName,
} from 'src/modules/variant/infras/repo/postgres/dto';
import { VariantPersistence } from 'src/modules/variant/infras/repo/postgres/dto';
import { reviewModelName } from 'src/modules/review/infras/repo/dto';
import { ImagePersistence } from 'src/modules/image/infras/repo/dto';
import { imageModelName } from 'src/modules/image/infras/repo/dto';
import { ReviewPersistence } from 'src/modules/review/infras/repo/dto';
import {
  inventoryModelName,
  InventoryPersistence,
  inventoryWarehouseModelName,
} from 'src/modules/inventory/infras/repo/postgres/dto';
import {
  permissionModelName,
  PermissionPersistence,
} from 'src/modules/permission/infras/repo/dto';
import {
  roleModelName,
  RolePersistence,
} from 'src/modules/role/infras/repo/dto';
import { permissionRoleModelName } from 'src/modules/permission/infras/repo/dto';
import {
  messageModelName,
  MessagePersistence,
} from 'src/modules/messages/infras/repo/postgres/dto';
import { entityModelName } from 'src/modules/messages/entity/infras/postgres/dto';
import { EntityPersistence } from 'src/modules/messages/entity/infras/postgres/dto';
import {
  actorModelName,
  ActorPersistence,
} from 'src/modules/messages/actor/infras/postgres/dto';
import { userModelName } from 'src/modules/user/infras/repo/dto';
import { UserPersistence } from 'src/modules/user/infras/repo/dto';
import {
  resourcePermissionModelName,
  resourcesModelName,
  ResourcesPersistence,
} from 'src/modules/resources/infras/repo/resources.dto';
import {
  optionsModelName,
  OptionsPersistence,
  optionValueModelName,
} from 'src/modules/options/infras/repo/postgres/dto';
import { OptionValuePersistence } from 'src/modules/options/infras/repo/postgres/dto';
import {
  productSellableImageModelName,
  productSellableModelName,
  ProductSellablePersistence,
  ProductSellableVariantPersistence,
  productSellableVariantModelName,
  productSellableDiscountModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import {
  blogsModelName,
  BlogsPersistence,
} from 'src/modules/blogs/infras/repo/blogs.dto';
import {
  couponModelName,
  CouponPersistence,
} from 'src/modules/coupon/infras/repo/postgres/coupon.dto';
import { warehouseModelName } from 'src/modules/warehouse/infras/repo/warehouse.dto';
import {
  brandModelName,
  BrandPersistence,
} from 'src/modules/brand/infras/repo/brand.dto';
import { WarehousePersistence } from 'src/modules/warehouse/infras/repo/warehouse.dto';
import {
  inventoryInvoiceModelName,
  InventoryInvoicePersistence,
} from 'src/modules/inventory_invoices/infras/repo/inventory_invoices.dto';

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
    foreignKey: 'payment_method_id',
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

  // TODO: add Receivables to OrderDetailPersistence

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

  OrderDetailPersistence.hasMany(
    PostgresOrderDetailProductSellablePersistence,
    {
      foreignKey: 'order_detail_id',
      as: orderDetailProductSellableHistoryModelName.toLowerCase(),
    }
  );

  PostgresOrderDetailProductSellablePersistence.belongsTo(
    OrderDetailPersistence,
    {
      foreignKey: 'order_detail_id',
      as: orderDetailModelName.toLowerCase(),
    }
  );

  ProductSellablePersistence.hasMany(
    PostgresOrderDetailProductSellablePersistence,
    {
      foreignKey: 'product_sellable_id',
      as: ProductSellableOrderDetailModelName.toLowerCase(),
    }
  );

  PostgresOrderDetailProductSellablePersistence.belongsTo(
    ProductSellablePersistence,
    {
      foreignKey: 'product_sellable_id',
      as: productSellableModelName.toLowerCase(),
    }
  );

  OrderDetailPersistence.belongsToMany(ProductSellablePersistence, {
    through: orderDetailProductSellableModelName,
    foreignKey: 'order_detail_id',
    otherKey: 'product_sellable_id',
    as: productSellableModelName.toLowerCase(),
  });

  ProductSellablePersistence.belongsToMany(OrderDetailPersistence, {
    through: orderDetailProductSellableModelName,
    foreignKey: 'product_sellable_id',
    otherKey: 'order_detail_id',
    as: orderDetailModelName.toLowerCase(),
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

  CartPersistence.belongsToMany(ProductSellablePersistence, {
    through: cartProductModelName,
    foreignKey: 'cart_id',
    otherKey: 'product_sellable_id',
    as: productSellableModelName.toLowerCase(),
  });

  ProductSellablePersistence.belongsToMany(CartPersistence, {
    through: cartProductModelName,
    foreignKey: 'product_sellable_id',
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
    onDelete: 'NO ACTION',
  });

  BrandPersistence.hasOne(ProductPersistence, {
    foreignKey: 'brand_id',
    as: productModelName.toLowerCase(),
  });

  ProductPersistence.belongsTo(BrandPersistence, {
    foreignKey: 'brand_id',
    as: brandModelName.toLowerCase(),
  });

  ProductPersistence.hasMany(VariantPersistence, {
    foreignKey: 'product_id',
    as: variantModelName.toLowerCase(),
    onDelete: 'CASCADE',
  });

  VariantPersistence.belongsTo(ProductPersistence, {
    foreignKey: 'product_id',
    as: productModelName.toLowerCase(),
  });

  OptionsPersistence.hasMany(OptionValuePersistence, {
    foreignKey: 'option_id',
    as: optionValueModelName.toLowerCase(),
    onDelete: 'CASCADE',
  });

  OptionValuePersistence.belongsTo(OptionsPersistence, {
    foreignKey: 'option_id',
    as: optionsModelName.toLowerCase(),
  });

  VariantPersistence.belongsToMany(OptionValuePersistence, {
    through: variantOptionValueModelName,
    foreignKey: 'variant_id',
    otherKey: 'option_value_id',
    as: optionValueModelName.toLowerCase(),
  });

  OptionValuePersistence.belongsToMany(VariantPersistence, {
    through: variantOptionValueModelName,
    foreignKey: 'option_value_id',
    otherKey: 'variant_id',
    as: variantModelName.toLowerCase(),
  });

  ProductSellablePersistence.belongsToMany(ImagePersistence, {
    through: productSellableImageModelName,
    foreignKey: 'product_sellable_id',
    otherKey: 'image_id',
    as: imageModelName.toLowerCase(),
  });

  ImagePersistence.belongsToMany(ProductSellablePersistence, {
    through: productSellableImageModelName,
    foreignKey: 'image_id',
    otherKey: 'product_sellable_id',
    as: productSellableModelName.toLowerCase(),
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

  ProductSellablePersistence.belongsToMany(DiscountPersistence, {
    through: productSellableDiscountModelName,
    foreignKey: 'product_sellable_id',
    otherKey: 'discount_id',
    as: discountModelName.toLowerCase(),
  });

  DiscountPersistence.belongsToMany(ProductSellablePersistence, {
    through: productSellableDiscountModelName,
    foreignKey: 'discount_id',
    otherKey: 'product_sellable_id',
    as: productSellableModelName.toLowerCase(),
  });

  DiscountPersistence.hasOne(CouponPersistence, {
    foreignKey: 'discount_id',
    as: couponModelName.toLowerCase(),
    onDelete: 'CASCADE',
  });

  CouponPersistence.belongsTo(DiscountPersistence, {
    foreignKey: 'discount_id',
    as: discountModelName.toLowerCase(),
    onDelete: 'CASCADE',
  });

  ProductSellablePersistence.belongsTo(VariantPersistence, {
    foreignKey: 'variant_id',
    as: variantModelName.toLowerCase(),
    onDelete: 'CASCADE',
  });

  VariantPersistence.hasOne(ProductSellablePersistence, {
    foreignKey: 'variant_id',
    as: productSellableModelName.toLowerCase(),
    onDelete: 'CASCADE',
  });

  ProductSellablePersistence.hasOne(InventoryPersistence, {
    foreignKey: 'product_sellable_id',
    as: inventoryModelName.toLowerCase(),
    onDelete: 'CASCADE',
  });

  InventoryPersistence.belongsTo(ProductSellablePersistence, {
    foreignKey: 'product_sellable_id',
    as: productSellableModelName.toLowerCase(),
    onDelete: 'CASCADE',
  });

  InventoryPersistence.belongsToMany(WarehousePersistence, {
    through: inventoryWarehouseModelName,
    foreignKey: 'inventory_id',
    otherKey: 'warehouse_id',
    as: warehouseModelName.toLowerCase(),
  });

  WarehousePersistence.belongsToMany(InventoryPersistence, {
    through: inventoryWarehouseModelName,
    foreignKey: 'warehouse_id',
    otherKey: 'inventory_id',
    as: inventoryModelName.toLowerCase(),
  });

  InventoryPersistence.hasMany(InventoryInvoicePersistence, {
    foreignKey: 'inventory_id',
    as: inventoryInvoiceModelName.toLowerCase(),
  });

  InventoryInvoicePersistence.belongsTo(InventoryPersistence, {
    foreignKey: 'inventory_id',
    as: inventoryModelName.toLowerCase(),
  });

  WarehousePersistence.hasMany(InventoryInvoicePersistence, {
    foreignKey: 'warehouse_id',
    as: inventoryInvoiceModelName.toLowerCase(),
  });

  InventoryInvoicePersistence.belongsTo(WarehousePersistence, {
    foreignKey: 'warehouse_id',
    as: warehouseModelName.toLowerCase(),
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

  CategoryPersistence.belongsTo(ImagePersistence, {
    foreignKey: 'image_id',
  });

  ImagePersistence.hasOne(CategoryPersistence, {
    foreignKey: 'image_id',
  });

  UserPersistence.belongsTo(ImagePersistence, {
    foreignKey: 'image_id',
  });

  ImagePersistence.hasOne(UserPersistence, {
    foreignKey: 'image_id',
  });

  UserPersistence.belongsTo(RolePersistence, {
    foreignKey: 'role_id',
    as: roleModelName.toLowerCase(),
  });

  RolePersistence.hasMany(UserPersistence, {
    foreignKey: 'role_id',
    as: userModelName.toLowerCase(),
  });

  RolePersistence.belongsToMany(PermissionPersistence, {
    through: permissionRoleModelName,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: permissionModelName.toLowerCase(),
  });

  PermissionPersistence.belongsToMany(RolePersistence, {
    through: permissionRoleModelName,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: roleModelName.toLowerCase(),
  });

  UserPersistence.hasMany(BlogsPersistence, {
    foreignKey: 'user_id',
    as: blogsModelName.toLocaleLowerCase(),
  });

  BlogsPersistence.belongsTo(UserPersistence, {
    foreignKey: 'user_id',
    as: userModelName.toLowerCase(),
  });
};
