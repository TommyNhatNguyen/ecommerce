import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { ModelStatus } from "src/share/models/base-model";
import { v7 as uuidv7 } from 'uuid';
export class OrderDetailPersistence extends Model {
  declare id: string;
  declare subtotal: number;
  declare total_shipping_fee: number;
  declare total_payment_fee: number;
  declare total_costs: number;
  declare total: number;
  declare shipping_id: string;
  declare payment_id: string;
  declare customer_id: string;
  declare customer_name: string;
  declare customer_phone: string;
  declare customer_email: string;
  declare customer_address: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export const orderDetailModelName = 'order_detail';

export const orderDetailInit = (sequelize: Sequelize) => {
  OrderDetailPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_shipping_fee: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_payment_fee: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_costs: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      shipping_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      payment_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customer_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'order_detail',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: orderDetailModelName,
    }
  );
}