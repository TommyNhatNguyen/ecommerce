import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus, PaymentMethod } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class PaymentPersistence extends Model {
  declare id: string;
  declare payment_method_id: string;
  declare paid_amount: number;
  declare paid_all_date: string | null;
  declare status: ModelStatus;
  declare created_at: string;
  declare updated_at: string;
}

export const paymentModelName = 'payment';

export const paymentInit = (sequelize: Sequelize) => {
  PaymentPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
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
      paid_all_date: {
        type: DataTypes.DATE,
        defaultValue: null,
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
