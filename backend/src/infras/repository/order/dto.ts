import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus, OrderState } from 'src/share/models/base-model';

export class OrderPersistence extends Model {
  declare id: string;
  declare customer_id: string;
  declare order_state: OrderState;
  declare total_price: number;
  declare shipping_method_id: string;
  declare payment_method_id: string;
  declare shipping_address: string;
  declare paid_amount: number;
  declare status: ModelStatus;
}

export const orderModelName = 'order';

export const orderInit = (sequelize: Sequelize) => {
  OrderPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      customer_id: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: true },
      shipping_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order_state: {
        type: DataTypes.ENUM(...Object.values(OrderState)),
        allowNull: false,
        defaultValue: OrderState.PENDING,
      },
      total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      shipping_method_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_method_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paid_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'orders',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: orderModelName,
    }
  );
};
