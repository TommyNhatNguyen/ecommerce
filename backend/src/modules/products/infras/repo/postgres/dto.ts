import { ModelStatus } from "src/share/models/base-model";
import { DataTypes, Model, Sequelize } from "sequelize";
import { v7 as uuidv7 } from "uuid";
export class ProductPersistence extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare status: ModelStatus;
}

export const productModelName = "product";

export function init(sequelize: Sequelize) {
  ProductPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      short_description: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: "products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      modelName: productModelName,
    }
  );
}

/**
 * ------------------------------------------------------------
 * JUNCTION TABLES
 * ------------------------------------------------------------
 */
export const productCategoryModelName = "productcategory";
export class ProductCategoryPersistence extends Model {
  declare product_id: string;
  declare category_id: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initProductCategory(sequelize: Sequelize) {
  ProductCategoryPersistence.init(
    {
      product_id: { type: DataTypes.UUID, allowNull: false },
      category_id: { type: DataTypes.UUID, allowNull: false },
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
      tableName: "products_categories",
      timestamps: false,
      modelName: productCategoryModelName,
    }
  );
}

export const productImageModelName = "product_image";

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
      product_id: { type: DataTypes.UUID, allowNull: false },
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
      tableName: "products_images",
      timestamps: false,
      modelName: productImageModelName,
    }
  );
}
