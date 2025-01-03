import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';

export class VariantPersistence extends Model {
  declare id: string;
  declare name: string;
  declare status: ModelStatus;
}

export const variantModelName = 'variant';

export const variantInit = (sequelize: Sequelize) => {
  VariantPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'variants',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: variantModelName,
    }
  );
};
