import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ActorType } from 'src/modules/messages/actor/models/actor.model';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class ActorPersistence extends Model {
  declare id: string;
  declare type: string;
  declare actor_id: string;
  declare status: ModelStatus;
}

export const actorModelName = 'actor';

export const actorInit = (sequelize: Sequelize) => {
  ActorPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ActorType)),
        allowNull: false,
      },
      actor_info_id: {
        type: DataTypes.UUID,
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
      tableName: 'actors',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: actorModelName,
    }
  );
};
