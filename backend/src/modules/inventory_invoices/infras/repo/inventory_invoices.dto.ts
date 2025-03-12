import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { InventoryInvoiceType } from "src/modules/inventory_invoices/models/inventory_invoices.model";
import { ModelStatus } from "src/share/models/base-model";
import { v7 as uuidv7 } from 'uuid';

export class InventoryInvoicePersistence extends Model {
  declare id: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}
export const inventoryInvoiceModelName = 'inventory_invoice';

export const inventoryInvoiceInit = (sequelize: Sequelize) => {
  InventoryInvoicePersistence.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => uuidv7(),
    },
    type: {
      type: DataTypes.ENUM(...Object.values(InventoryInvoiceType)),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ModelStatus)),
      allowNull: false,
      defaultValue: ModelStatus.ACTIVE,
    },
  }, {
    sequelize,
    tableName: inventoryInvoiceModelName,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: inventoryInvoiceModelName,
  });
}