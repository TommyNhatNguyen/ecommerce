import { DataTypes, Sequelize } from 'sequelize';
import { Model } from 'sequelize';
import { ModelStatus, ResourcesType } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class ResourcesPersistence extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const resourcesModelName = 'resources';

export const resourcesInit = (sequelize: Sequelize) => {
  ResourcesPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ResourcesType)),
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
      tableName: resourcesModelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: resourcesModelName,
    }
  );
};

// -------- Juntion Table --------

export class ResourcePermissionPersistence extends Model {
  declare resource_id: string;
  declare permission_id: string;
}

export const resourcePermissionModelName = 'resource_permission';

export const resourcePermissionInit = (sequelize: Sequelize) => {
  ResourcePermissionPersistence.init(
    {
      resource_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      permission_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      is_allow: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: resourcePermissionModelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: resourcePermissionModelName,
    }
  );
};
