import { DataTypes, Sequelize } from 'sequelize';
import { Model } from 'sequelize';
import { DiscountType } from 'src/modules/discount/models/discount.model';
import { ModelStatus, NumberType } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class OrderDetailPersistence extends Model {
  declare id: string;
  declare subtotal: number;
  declare total_shipping_fee: number;
  declare total_payment_fee: number;
  declare total_costs: number;
  declare total_order_discount: number;
  declare total_product_discount: number;
  declare total_discount: number;
  declare total: number;
  declare shipping_method_id: string;
  declare payment_id: string;
  declare customer_id: string;
  declare customer_name: string;
  declare customer_phone: string;
  declare customer_email: string;
  declare customer_address: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export const orderDetailModelName = 'order_detail';

export const orderDetailInit = (sequelize: Sequelize) => {
  OrderDetailPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_shipping_fee: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      total_payment_fee: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      total_costs: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      total_order_discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      total_product_discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      total_discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      shipping_method_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      payment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customer_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'order_detail',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: orderDetailModelName,
    }
  );
};

export class PostgresOrderDetailProductPersistence extends Model {
  declare order_detail_id: string;
  declare product_id: string;
  declare quantity: number;
  declare price: number;
  declare subtotal: number;
  declare discount_amount: number;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export const orderDetailProductModelName = 'orderdetailproduct';

export function orderDetailProductInit(sequelize: Sequelize) {
  PostgresOrderDetailProductPersistence.init(
    {
      order_detail_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      discount_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
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
      tableName: 'order_detail_product',
      timestamps: false,
      modelName: orderDetailProductModelName,
    }
  );
}

export class PostgresOrderDetailCostPersistence extends Model {
  declare order_detail_id: string;
  declare cost_id: string;
  declare cost_type: string;
  declare cost_amount: number;
  declare cost_name: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export const orderDetailCostModelName = 'orderdetailcost';

export function orderDetailCostInit(sequelize: Sequelize) {
  PostgresOrderDetailCostPersistence.init(
    {
      order_detail_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      cost_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
      tableName: 'order_detail_cost',
      timestamps: false,
      modelName: orderDetailCostModelName,
    }
  );
}

export class PostgresOrderDetailDiscountPersistence extends Model {
  declare order_detail_id: string;
  declare cost_id: string;
  declare cost_type: string;
  declare cost_amount: number;
  declare cost_name: string;
  declare status: ModelStatus;
  declare created_at: Date;
  declare updated_at: Date;
}

export const orderDetailDiscountModelName = 'orderdetaildiscount';

export function orderDetailDiscountInit(sequelize: Sequelize) {
  PostgresOrderDetailDiscountPersistence.init(
    {
      order_detail_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      discount_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
      tableName: 'order_detail_discount',
      timestamps: false,
      modelName: orderDetailDiscountModelName,
    }
  );
}
