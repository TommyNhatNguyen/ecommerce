import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class PaymentMethodPersistence extends Model {
  declare id: string;
  declare status: ModelStatus;
  declare type: string;
  declare cost: number;
}

export const paymentMethodModelName = 'payment_method';

export const paymentMethodInit = (sequelize: Sequelize) => {
  PaymentMethodPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: uuidv7(),
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      cost: {
        type: DataTypes.FLOAT,
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
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: paymentMethodModelName,
    }
  );
};
