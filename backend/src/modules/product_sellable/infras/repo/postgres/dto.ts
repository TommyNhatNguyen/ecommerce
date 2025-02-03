import { DataTypes, Model, Sequelize } from 'sequelize';
import { variantModelName } from 'src/modules/variant/infras/repo/postgres/dto';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class ProductSellablePersistence extends Model {
  declare id: string;
  declare price: number;
  declare total_discounts: number;
  declare price_after_discounts: number;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export const productSellableModelName = 'product_sellable';

export function productSellableInit(sequelize: Sequelize) {
  ProductSellablePersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      price: { type: DataTypes.FLOAT, allowNull: false },
      total_discounts: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      price_after_discounts: { type: DataTypes.FLOAT, allowNull: false },
      variant_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: `${variantModelName}s`,
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: productSellableModelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: productSellableModelName,
    }
  );
}

export const productSellableDiscountModelName = 'product_sellable_discount';

export class ProductSellableDiscountPersistence extends Model {
  declare product_sellable_id: string;
  declare discount_id: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initProductSellableDiscount(sequelize: Sequelize) {
  ProductSellableDiscountPersistence.init(
    {
      product_sellable_id: { type: DataTypes.UUID, allowNull: false },
      discount_id: { type: DataTypes.UUID, allowNull: false },
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
      tableName: 'products_sellable_discounts',
      timestamps: false,
      modelName: productSellableDiscountModelName,
    }
  );
}

export const productSellableVariantModelName = 'product_sellable_variant';

export class ProductSellableVariantPersistence extends Model {
  declare product_sellable_id: string;
  declare variant_id: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initProductSellableVariant(sequelize: Sequelize) {
  ProductSellableVariantPersistence.init(
    {
      product_sellable_id: { type: DataTypes.UUID, allowNull: false },
      variant_id: { type: DataTypes.UUID, allowNull: false },
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
      tableName: 'products_sellable_variants',
      timestamps: false,
      modelName: productSellableVariantModelName,
    }
  );
}

export const productSellableImageModelName = 'product_sellable_image';

export class ProductSellableImagePersistence extends Model {
  declare id: string;
  declare product_sellable_id: string;
  declare image_id: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initProductSellableImage(sequelize: Sequelize) {
  ProductSellableImagePersistence.init(
    {
      product_sellable_id: { type: DataTypes.UUID, allowNull: false },
      image_id: { type: DataTypes.UUID, allowNull: false },
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
      tableName: 'products_sellable_images',
      timestamps: false,
      modelName: productSellableImageModelName,
    }
  );
}
