import { DataTypes, Model, Sequelize } from 'sequelize';
import { imageModelName, ImagePersistence } from 'src/infras/repository/image/dto';
import { ProductPersistence } from 'src/infras/repository/product/dto';
import { ModelStatus } from 'src/share/models/base-model';

export class CategoryPersistence extends Model {}

export const categoryModelName = 'category';

export const categoryInit = (sequelize: Sequelize) => {
  CategoryPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image_id: {
        type: DataTypes.UUID,
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
      tableName: 'categories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: categoryModelName,
    }
  );
};
