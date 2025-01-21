import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';

export class MessagePersistence extends Model {
  declare id: string;
  declare entity_id: string;
  declare actor_id: string;
  declare message: string;
  declare created_at: Date;
  declare updated_at: Date;
  declare status: ModelStatus;
}

export const messageModelName = 'message';

export const messageInit = (sequelize: Sequelize) => {
  MessagePersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      entity_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      actor_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      read_at: {
        type: DataTypes.DATE,
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
      tableName: 'messages',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: messageModelName,
    }
  );
};
