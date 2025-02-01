import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class VariantPersistence extends Model {
  declare id: string;
  declare name: string;
  declare value: string;
  declare status: ModelStatus;
}

export const variantModelName = 'variant';

export const variantInit = (sequelize: Sequelize) => {
  VariantPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      type: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: false },
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
