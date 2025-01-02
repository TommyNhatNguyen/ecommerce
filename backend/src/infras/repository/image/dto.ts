import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus, PermissionType } from 'src/share/models/base-model';

export class ImagePersistence extends Model {
  declare id: string;
  declare url: string;
  declare status: ModelStatus;
}

export const imageModelName = 'image';

export const imageInit = (sequelize: Sequelize) => {
  ImagePersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      url: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
      cloudinary_id: { type: DataTypes.STRING, allowNull: false },
      type: {
        type: DataTypes.ENUM(
          ...Object.values({ ...PermissionType, OTHER: 'OTHER' })
        ),
        allowNull: false,
        defaultValue: 'OTHER',
      },
    },
    {
      sequelize,
      tableName: 'images',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: imageModelName,
    }
  );
};
