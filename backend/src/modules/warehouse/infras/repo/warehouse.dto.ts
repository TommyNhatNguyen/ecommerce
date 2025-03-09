import { DataTypes, Sequelize } from 'sequelize';
import { Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class WarehousePersistence extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare address: string;
  declare total_quantity: number;
  declare total_cost: number;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export const warehouseModelName = 'warehouse';

export const warehouseInit = (sequelize: Sequelize) => {
  WarehousePersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
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
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      total_quantity: {
        type: DataTypes.BIGINT,
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
    },
    {
      sequelize,
      tableName: warehouseModelName,
      timestamps: false,
      modelName: warehouseModelName,
    }
  );
};
