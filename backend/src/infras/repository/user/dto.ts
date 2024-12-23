import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus, ShippingMethod } from 'src/share/models/base-model';

export class UserPersistence extends Model {
  declare id: string;
  declare username: string;
  declare hash_password: string;
  declare email: string;
  declare phone: string;
  declare status: ModelStatus;
}

export const userModelName = 'user';

export const userInit = (sequelize: Sequelize) => {
  UserPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hash_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      phone: {
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
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: userModelName,
    }
  );
};