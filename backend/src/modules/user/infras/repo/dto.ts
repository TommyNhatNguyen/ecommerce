import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { imageModelName } from 'src/infras/repository/image/dto';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
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
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hash_password: {
        type: DataTypes.TEXT,
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
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      image_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: `${imageModelName}s`,
          key: 'id',
        },
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
