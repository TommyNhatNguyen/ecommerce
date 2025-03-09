import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { StockStatus } from 'src/modules/inventory/models/inventory.model';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class InventoryPersistence extends Model {
  declare id: string;
  declare total_quantity: number;
  declare total_cost: number;
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
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      total_cost: {
        type: DataTypes.FLOAT,
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

export class InventoryWarehousePersistence extends Model {
  declare id: string;
  declare inventory_id: string;
  declare warehouse_id: string;
  declare quantity: number;
  declare cost: number;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}
export const inventoryWarehouseModelName = 'inventory_warehouse';

export const inventoryWarehouseInit = (sequelize: Sequelize) => {
  InventoryWarehousePersistence.init(
    {
      inventory_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      warehouse_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      cost: {
        type: DataTypes.FLOAT,
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
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'inventory_warehouses',
      timestamps: false,
      modelName: inventoryWarehouseModelName,
    }
  );
};
