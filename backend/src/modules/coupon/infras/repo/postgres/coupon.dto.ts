import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';

export class CouponPersistence extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare code: string;
  declare discount_id: string;
  declare start_date: Date;
  declare end_date: Date;
  declare status: ModelStatus;
}

export const couponModelName = 'coupon';
export const couponInit = (sequelize: Sequelize) => {
  CouponPersistence.init(
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
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      discount_id: { type: DataTypes.UUID, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: couponModelName,
    }
  );
};
