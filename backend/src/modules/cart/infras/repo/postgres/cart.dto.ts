import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { ModelStatus } from "src/share/models/base-model";
import { v7 as uuidv7 } from "uuid";
export class CartPersistence extends Model {
  declare id: string;
  declare product_quantity: number;
  declare product_count: number;
  declare subtotal: number;
  declare total_discount: number;
  declare total: number;
  declare status: ModelStatus;
  declare created_at: string;
  declare updated_at: string;
}

export const cartModelName = "cart";

export const cartInit = (sequelize: Sequelize) => {
  CartPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      product_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      product_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      subtotal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      total_discount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: cartModelName,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      modelName: cartModelName,
    }
  );
};

export class CartProductPersistence extends Model {
  declare cart_id: string;
  declare product_id: string;
  declare quantity: number;
  declare subtotal: number;
  declare discount_amount: number;
  declare total: number;
}

export const cartProductModelName = "cart_product_sellable";

export const cartProductInit = (sequelize: Sequelize) => {
  CartProductPersistence.init(
    {
      cart_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_sellable_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      subtotal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      discount_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      tableName: cartProductModelName,
      timestamps: false,
      modelName: cartProductModelName,
    }
  );
};
