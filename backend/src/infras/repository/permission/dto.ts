import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import {
  ModelStatus,
  PermissionType,
  ShippingMethod,
} from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
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
        defaultValue: () => uuidv7(),
      },
      type: {
        type: DataTypes.ENUM(...Object.values(PermissionType)),
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

export const permissionRoleModelName = 'permission_role';

export class PermissionRolePersistence extends Model {
  declare id: string;
  declare permission_id: string;
  declare role_id: string;
}

export const permissionRoleInit = (sequelize: Sequelize) => {
  PermissionRolePersistence.init(
    {
      permission_id: {
        type: DataTypes.ENUM(...Object.values(PermissionType)),
        allowNull: false,
      },
      role_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'permission_role',
      timestamps: false,
      modelName: permissionRoleModelName,
    }
  );
};
