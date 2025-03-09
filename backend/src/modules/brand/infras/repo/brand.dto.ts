import { DataTypes, Sequelize } from 'sequelize';
import { Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class BrandPersistence extends Model {}

export const brandModelName = 'brand';

export const brandInit = (sequelize: Sequelize) => {
  BrandPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
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
      tableName: 'brands',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: brandModelName,
    }
  );
};
