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
      description: { type: DataTypes.STRING, allowNull: true },
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

export class ProductCategoryPersistence extends Model {
  declare id: string;
  declare product_id: string;
  declare category_id: string;
  declare status: ModelStatus;
}

/**
 * ------------------------------------------------------------
 * JUNCTION TABLES
 * ------------------------------------------------------------
 */
export const productCategoryModelName = 'productcategory';

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
