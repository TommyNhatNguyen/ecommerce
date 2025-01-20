import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { EntityKind } from 'src/modules/messages/entity/models/entity.model';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class EntityPersistence extends Model {
  declare id: string;
  declare kind: EntityKind;
  declare type: string;
  declare template: string;
  declare status: ModelStatus;
}

export const entityModelName = 'entity';

export const entityInit = (sequelize: Sequelize) => {
  EntityPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      kind: {
        type: DataTypes.ENUM(...Object.values(EntityKind)),
        allowNull: false,
      },
      template: {
        type: DataTypes.TEXT,
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
      tableName: 'entities',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: entityModelName,
    }
  );
};
