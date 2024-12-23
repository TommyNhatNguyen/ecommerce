import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus, PaymentMethod } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class PaymentPersistence extends Model {
  declare id: string;
  declare type: PaymentMethod;
  declare status: ModelStatus;
}

export const paymentModelName = 'payment';

export const paymentInit = (sequelize: Sequelize) => {
  PaymentPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fee: {
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
      tableName: 'payments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: paymentModelName,
    }
  );
};
