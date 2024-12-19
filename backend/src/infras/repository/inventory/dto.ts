import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';

export class InventoryPersistence extends Model {
  declare id: string;
  declare product_id: string;
  declare quantity: number;
  declare status: ModelStatus;
}

export const inventoryModelName = 'inventory';

export const inventoryInit = (sequelize: Sequelize) => {
  InventoryPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      product_id: { type: DataTypes.STRING, allowNull: false },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'inventories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: inventoryModelName,
    }
  );
};
