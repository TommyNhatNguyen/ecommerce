import { DataTypes, Model, Sequelize } from 'sequelize';
import { ProductPersistence } from 'src/infras/repository/product/dto';
import { ModelStatus } from 'src/share/models/base-model';

export class CategoryPersistence extends Model {}

export const categoryModelName = 'Category';

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
        type: DataTypes.STRING,
        allowNull: true,
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
