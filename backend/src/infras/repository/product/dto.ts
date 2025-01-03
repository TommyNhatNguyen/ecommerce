import { ModelStatus } from 'src/share/models/base-model';
import { DataTypes, Model, Sequelize } from 'sequelize';
export class ProductPersistence extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare status: ModelStatus;
}

export const productModelName = 'product';

export function init(sequelize: Sequelize) {
  ProductPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.FLOAT, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'products',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: productModelName,
    }
  );
}

/**
 * ------------------------------------------------------------
 * JUNCTION TABLES
 * ------------------------------------------------------------
 */
export const productCategoryModelName = 'productcategory';
export class ProductCategoryPersistence extends Model {
  declare id: string;
  declare product_id: string;
  declare category_id: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initProductCategory(sequelize: Sequelize) {
  ProductCategoryPersistence.init(
    {
      product_id: { type: DataTypes.STRING, allowNull: false },
      category_id: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'products_categories',
      timestamps: false,
      modelName: productCategoryModelName,
    }
  );
}

export const productDiscountModelName = 'productdiscount';

export class ProductDiscountPersistence extends Model {
  declare id: string;
  declare product_id: string;
  declare discount_id: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initProductDiscount(sequelize: Sequelize) {
  ProductDiscountPersistence.init(
    {
      product_id: { type: DataTypes.STRING, allowNull: false },
      discount_id: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'products_discounts',
      timestamps: false,
      modelName: productDiscountModelName,
    }
  );
}

export const productVariantModelName = 'productvariant';

export class ProductVariantPersistence extends Model {
  declare id: string;
  declare product_id: string;
  declare variant_id: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initProductVariant(sequelize: Sequelize) {
  ProductVariantPersistence.init(
    {
      product_id: { type: DataTypes.STRING, allowNull: false },
      variant_id: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'products_variants',
      timestamps: false,
      modelName: productVariantModelName,
    }
  );
}

export const productImageModelName = 'productimage';

export class ProductImagePersistence extends Model {
  declare id: string;
  declare product_id: string;
  declare image_id: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initProductImage(sequelize: Sequelize) {
  ProductImagePersistence.init(
    {
      product_id: { type: DataTypes.STRING, allowNull: false },
      image_id: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'products_images',
      timestamps: false,
      modelName: productImageModelName,
    }
  );
}

export const productOrderModelName = 'productorder';

export class ProductOrderPersistence extends Model {
  declare id: string;
  declare product_id: string;
  declare order_id: string;
  declare quantity: number;
  declare subtotal: number;
  declare discount_id: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initProductOrder(sequelize: Sequelize) {
  ProductOrderPersistence.init(
    {
      product_id: { type: DataTypes.STRING, allowNull: false },
      order_id: { type: DataTypes.STRING, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      subtotal: { type: DataTypes.FLOAT, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'products_orders',
      timestamps: false,
      modelName: productOrderModelName,
    }
  );
}
