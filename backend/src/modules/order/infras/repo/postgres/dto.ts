import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus, OrderState } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class OrderPersistence extends Model {
  declare id: string;
  declare order_state: OrderState;
  declare status: ModelStatus;
  declare order_detail_id: string;
}

export const orderModelName = 'order';

export const orderInit = (sequelize: Sequelize) => {
  OrderPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      order_state: {
        type: DataTypes.ENUM(...Object.values(OrderState)),
        allowNull: false,
        defaultValue: OrderState.PENDING,
      },
      order_detail_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
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
