import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus, ShippingMethod } from 'src/share/models/base-model';

export class PermissionPersistence extends Model {
  declare id: string;
  declare name: string;
  declare status: ModelStatus;
}

export const permissionModelName = 'permission';

export const permissionInit = (sequelize: Sequelize) => {
  PermissionPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: {
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
      tableName: 'permissions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: permissionModelName,
    }
  );
};
