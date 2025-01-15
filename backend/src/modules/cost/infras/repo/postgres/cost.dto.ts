import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatus, NumberType } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class CostPersistence extends Model {
  declare id: string;
  declare type: NumberType;
  declare name: string;
  declare cost: number;
  declare description: string;
}

export const costModelName = 'cost';

export const costInit = (sequelize: Sequelize) => {
  CostPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      type: {
        type: DataTypes.ENUM(...Object.values(NumberType)),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cost: {
        type: DataTypes.FLOAT,
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
      tableName: costModelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: costModelName,
    }
  );
};
