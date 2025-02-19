import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { DiscountScope } from 'src/modules/discount/models/discount.model';
import { DiscountType } from 'src/modules/discount/models/discount.model';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class DiscountPersistence extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare amount: number;
  declare is_fixed: boolean;
  declare max_discount_count: number;
  declare discount_count: number;
  declare require_product_count: number;
  declare require_order_amount: number;
  declare is_free: boolean;
  declare has_max_discount_count: boolean;
  declare is_require_product_count: boolean;
  declare is_require_order_amount: boolean;
  declare scope: DiscountScope;
  declare start_date: Date;
  declare end_date: Date;
  declare status: ModelStatus;
}

export const discountModelName = 'discount';
export const discountInit = (sequelize: Sequelize) => {
  DiscountPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
      },
      is_fixed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      max_discount_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      discount_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      require_product_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      require_order_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      is_free: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      has_max_discount_count: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_require_product_count: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_require_order_amount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      scope: {
        type: DataTypes.ENUM(...Object.values(DiscountScope)),
        allowNull: false,
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
