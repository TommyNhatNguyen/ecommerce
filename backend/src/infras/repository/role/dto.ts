import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus, ShippingMethod } from 'src/share/models/base-model';

export class RolePersistence extends Model {
  declare id: string;
  declare name: string;
  declare status: ModelStatus;
}

export const roleModelName = 'role';

export const roleInit = (sequelize: Sequelize) => {
  RolePersistence.init(
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
      tableName: 'roles',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: roleModelName,
    }
  );
};
