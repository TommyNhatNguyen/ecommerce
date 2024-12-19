import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';

export class CustomerPersistence extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare address: string;
  declare status: ModelStatus;
}

export const customerModelName = 'customer';

export const customerInit = (sequelize: Sequelize) => {
  CustomerPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: true },
      full_name: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.get('first_name')} ${this.get('last_name')}`;
        },
      },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
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
      tableName: 'customers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: customerModelName,
    }
  );
};
