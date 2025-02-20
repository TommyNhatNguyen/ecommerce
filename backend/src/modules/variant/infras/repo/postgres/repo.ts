import {
  VariantConditionDTO,
  VariantCreateDTO,
  VariantOptionValueCreateDTO,
  VariantUpdateDTO,
} from 'src/modules/variant/models/variant.dto';
import { IVariantRepository } from 'src/modules/variant/models/variant.interface';
import { Variant } from 'src/modules/variant/models/variant.model';
import { Includeable, Op, Sequelize } from 'sequelize';
import {
  BaseSortBy,
  BaseOrder,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  productModelName,
  ProductPersistence,
} from 'src/modules/products/infras/repo/postgres/dto';
import {
  optionsModelName,
  OptionsPersistence,
  optionValueModelName,
} from 'src/modules/options/infras/repo/postgres/dto';
import { OptionValuePersistence } from 'src/modules/options/infras/repo/postgres/dto';
import {
  productSellableModelName,
  ProductSellablePersistence,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import {
  imageModelName,
  ImagePersistence,
} from 'src/infras/repository/image/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { WhereOptions } from '@sequelize/core';
import { Transaction } from 'sequelize';

export class PostgresVariantRepository implements IVariantRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async addOptionValue(
    data: VariantOptionValueCreateDTO[],
    t?: Transaction
  ): Promise<boolean> {
    if (t) {
      await this.sequelize.models[this.modelName].bulkCreate(data, {
        transaction: t,
      });
    } else {
      await this.sequelize.models[this.modelName].bulkCreate(data);
    }
    return true;
  }
  async get(id: string, condition: VariantConditionDTO): Promise<Variant> {
    const include: Includeable[] = [];
    const optionValueInclude: Includeable[] = [];
    const optionValueWhere: WhereOptions = {};
    const where: WhereOptions = {};
    if (condition?.include_product) {
      include.push({
        model: ProductPersistence,
        as: productModelName.toLowerCase(),
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES],
        },
      });
    }
    if (condition?.include_product_sellable) {
      include.push({
        model: ProductSellablePersistence,
        as: productSellableModelName.toLowerCase(),
        include: [
          {
            model: ImagePersistence,
            as: imageModelName.toLowerCase(),
            attributes: {
              exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'],
            },
            through: {
              attributes: [],
            },
          },
        ],
      });
    }
    if (condition?.include_options_value) {
      if (condition?.include_option) {
        optionValueInclude.push({
          model: OptionsPersistence,
          as: optionsModelName.toLowerCase(),
        });
      }
      if (condition?.option_value_ids) {
        optionValueWhere.id = {
          [Op.in]: condition?.option_value_ids,
        };
      }
      include.push({
        model: OptionValuePersistence,
        as: optionValueModelName.toLowerCase(),
        through: {
          attributes: [],
        },
        include: optionValueInclude,
      });
    }
    if (condition?.product_id) {
      where.product_id = condition?.product_id;
    }
    const variant = await this.sequelize.models[this.modelName].findByPk(id, {
      include,
    });
    return variant?.dataValues;
  }
  async list(
    paging: PagingDTO,
    condition: VariantConditionDTO
  ): Promise<ListResponse<Variant[]>> {
    const include: Includeable[] = [];
    const where: WhereOptions = {};
    const optionValueInclude: Includeable[] = [];
    const optionValueWhere: WhereOptions = {};
    if (condition?.include_product) {
      include.push({
        model: ProductPersistence,
        as: productModelName.toLowerCase(),
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES],
        },
      });
    }
    if (condition?.include_product_sellable) {
      include.push({
        model: ProductSellablePersistence,
        as: productSellableModelName.toLowerCase(),
        include: [
          {
            model: ImagePersistence,
            as: imageModelName.toLowerCase(),
            attributes: {
              exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'],
            },
            through: {
              attributes: [],
            },
          },
        ],
      });
    }
    if (condition?.include_options_value) {
      if (condition?.include_option) {
        optionValueInclude.push({
          model: OptionsPersistence,
          as: optionsModelName.toLowerCase(),
        });
      }
      if (condition?.option_value_ids) {
        const optionValueIds = condition?.option_value_ids
          .map((id) => `'${id}'`)
          .join(', ');
        where.id = {
          [Op.in]: this.sequelize.literal(
            `(
              SELECT variant_id 
              FROM variant_option_value 
              WHERE option_value_id IN (${optionValueIds})
              GROUP BY variant_id
              HAVING COUNT(DISTINCT option_value_id) = ${condition?.option_value_ids.length} 
            )`
          ),
        };
      }
      include.push({
        model: OptionValuePersistence,
        as: optionValueModelName.toLowerCase(),
        through: {
          attributes: [],
        },
        include: optionValueInclude,
        where: optionValueWhere,
      });
    }
    if (condition?.product_id) {
      where.product_id = condition?.product_id;
    }
    const { page, limit } = paging;
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
      where,
      include,
      distinct: true,
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        limit,
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async insert(data: VariantCreateDTO, t?: Transaction): Promise<Variant> {
    if (t) {
      const result = await this.sequelize.models[this.modelName].create(data, {
        returning: true,
        transaction: t,
      });
      return result?.dataValues;
    } else {
      const result = await this.sequelize.models[this.modelName].create(data, {
        returning: true,
      });
      return result?.dataValues;
    }
  }
  async update(id: string, data: VariantUpdateDTO): Promise<Variant> {
    const result = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return result[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
