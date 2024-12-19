import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus, ShippingMethod } from 'src/share/models/base-model';

export class ShippingPersistence extends Model {
  declare id: string;
  declare customer_id: string;
  declare status: ModelStatus;
}

export const shippingModelName = 'shipping';

export const shippingInit = (sequelize: Sequelize) => {
  ShippingPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ShippingMethod)),
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
      tableName: 'shippings',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: shippingModelName,
    }
  );
};
