import { Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class VariantPersistence extends Model {
  declare id: string;
  declare name: string;
  declare value: string;
  declare status: ModelStatus;
}

export const variantModelName = 'variant';

export const variantInit = (sequelize: Sequelize) => {
  VariantPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: () => uuidv7(),
      },
      name: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: 'variants',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: variantModelName,
    }
  );
};

export class VariantOptionValuePersistence extends Model {
  declare id: string;
  declare variant_id: string;
  declare option_value_id: string;
}

export const variantOptionValueModelName = 'variant_option_value';

export const variantOptionValueInit = (sequelize: Sequelize) => {
  VariantOptionValuePersistence.init(
    {
      variant_id: { type: DataTypes.UUID, allowNull: false },
      option_value_id: { type: DataTypes.UUID, allowNull: false },
      status: {
        type: DataTypes.ENUM(...Object.values(ModelStatus)),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
    },
    {
      sequelize,
      tableName: variantOptionValueModelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: variantOptionValueModelName,
    }
  );
};



// export const variantImageModelName = 'variant_image';

// export class VariantImagePersistence extends Model {
//   declare id: string;
//   declare variant_id: string;
//   declare image_id: string;
//   declare status: ModelStatus;
//   declare created_at: Date;
//   declare updated_at: Date;
// }

// export function initVariantImage(sequelize: Sequelize) {
//   VariantImagePersistence.init(
//     {
//       variant_id: { type: DataTypes.UUID, allowNull: false },
//       image_id: { type: DataTypes.UUID, allowNull: false },
//       status: {
//         type: DataTypes.ENUM(...Object.values(ModelStatus)),
//         allowNull: false,
//         defaultValue: ModelStatus.ACTIVE,
//       },
//       created_at: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//       updated_at: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//     },
//     {
//       sequelize,
//       tableName: 'variant_images',
//       timestamps: false,
//       modelName: variantImageModelName,
//     }
//   );
// }

