import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class ReviewPersistence extends Model {
  declare id: string;
  declare customer_id: string;
  declare rating: number;
  declare comment: string;
  declare status: ModelStatus;
}

export const reviewModelName = 'review';

export const reviewInit = (sequelize: Sequelize) => {
  ReviewPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      customer_id: { type: DataTypes.STRING, allowNull: false },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 5 },
      },
      comment: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'reviews',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: reviewModelName,
    }
  );
};
