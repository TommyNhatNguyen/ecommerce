import { StockStatus } from '@models/inventory/inventory.model';
import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { productModelName } from 'src/infras/repository/product/dto';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class InventoryPersistence extends Model {
  declare id: string;
  declare quantity: number;
  declare status: ModelStatus;
  declare stock_status: StockStatus;
  declare low_stock_threshold: number;
  declare created_at: Date;
  declare updated_at: Date;
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
        defaultValue: () => uuidv7(),
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      low_stock_threshold: {
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      stock_status: {
        type: DataTypes.ENUM(...Object.values(StockStatus)),
        allowNull: false,
        defaultValue: StockStatus.IN_STOCK,
      },
    },
    {
      sequelize,
      tableName: 'inventories',
      timestamps: false,
      modelName: inventoryModelName,
    }
  );
};
