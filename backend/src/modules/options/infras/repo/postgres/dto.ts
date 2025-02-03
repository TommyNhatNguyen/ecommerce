import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';

export class OptionsPersistence extends Model {
  declare id: string;
  declare name: string;
  declare created_at: Date;
  declare updated_at: Date;
  declare status: ModelStatus;
}

export const optionsModelName = 'options';

export const optionsInit = (sequelize: Sequelize) => {
  OptionsPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      name: { type: DataTypes.STRING, allowNull: false },
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
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
      is_color: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'options',
      timestamps: false,
      modelName: optionsModelName,
    }
  );
};

export class OptionValuePersistence extends Model {
  declare id: string;
  declare name: string;
  declare value: string;
  declare created_at: Date;
  declare updated_at: Date;
  declare status: ModelStatus;
}

export const optionValueModelName = 'option_values';

export const optionValueInit = (sequelize: Sequelize) => {
  OptionValuePersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      name: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: false },
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
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'option_values',
      timestamps: false,
      modelName: optionValueModelName,
    }
  );
};
