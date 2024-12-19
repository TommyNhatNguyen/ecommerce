import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';

export class DiscountPersistence extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare discount_percentage: number;
  declare start_date: Date;
  declare end_date: Date;
  declare status: ModelStatus;
}

export const discountModelName = 'discount';

export const discountInit = (sequelize: Sequelize) => {
  DiscountPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      description: { type: DataTypes.STRING, allowNull: true },
      discount_percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0, max: 100 },
      },
      start_date: { type: DataTypes.DATE, allowNull: false },
      end_date: { type: DataTypes.DATE, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'discounts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: discountModelName,
    }
  );
};
