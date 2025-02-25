import { DataTypes, Model, Sequelize } from 'sequelize';
import {
  imageModelName,
  ImagePersistence,
} from 'src/infras/repository/image/dto';
import { userModelName } from 'src/modules/user/infras/repo/dto';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class BlogsPersistence extends Model {}

export const blogsModelName = 'blogs';

export const blogsInit = (sequelize: Sequelize) => {
  BlogsPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      short_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      thumnail_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
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
      tableName: 'blogs',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: blogsModelName,
    }
  );
};
