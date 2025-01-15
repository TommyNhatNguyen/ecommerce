import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { ModelStatus } from "src/share/models/base-model";
import { v7 as uuidv7 } from 'uuid';
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

export const cartModelName = 'cart';

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
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.INTEGER,
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
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: cartModelName,
    }
  );
}