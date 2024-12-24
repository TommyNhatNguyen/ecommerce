import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus, Roles, ShippingMethod } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';

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
        defaultValue: uuidv7(),
      },
      name: {
        type: DataTypes.ENUM(...Object.values(Roles)),
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
