import { ModelStatus } from 'src/share/models/base-model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProductPersistence extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare status: ModelStatus;
}

export const productModelName = 'Product';

export function init(sequelize: Sequelize) {
  ProductPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: true },
      price: { type: DataTypes.FLOAT, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'products',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: productModelName,
    }
  );
}
