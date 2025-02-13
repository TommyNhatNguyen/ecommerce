import { Sequelize } from "sequelize";
import { DataTypes, Model } from "sequelize";
import { ModelStatus } from "src/share/models/base-model";
import { v7 as uuidv7 } from "uuid";
export class CustomerPersistence extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare address: string;
  declare status: ModelStatus;
  declare cart_id: string;
  declare first_name: string;
  declare last_name: string;
  declare city_id: string;
  declare province_id: string;
  declare country_id: string;
}

export const customerModelName = "customer";

export const customerInit = (sequelize: Sequelize) => {
  CustomerPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      hash_password: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cart_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      first_name: { type: DataTypes.STRING, allowNull: true },
      last_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: true, unique: true },
      phone: { type: DataTypes.STRING, allowNull: false, unique: true },
      address: { type: DataTypes.STRING, allowNull: true },
      city_id: { type: DataTypes.STRING, allowNull: true },
      province_id: { type: DataTypes.STRING, allowNull: true },
      country_id: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: "customers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      modelName: customerModelName,
    }
  );
};
