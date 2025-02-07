import {
  OptionConditionDTO,
  OptionCreateDTO,
  OptionUpdateDTO,
  OptionValueConditionDTO,
  OptionValueCreateDTO,
  OptionValueUpdateDTO,
} from 'src/modules/options/models/option.dto';
import {
  IOptionRepository,
  IOptionValueRepository,
} from 'src/modules/options/models/option.interface';
import { Option, OptionValue } from 'src/modules/options/models/option.model';
import { Includeable, Sequelize, WhereOptions } from 'sequelize';
import {
  BaseSortBy,
  BaseOrder,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  optionValueModelName,
  OptionValuePersistence,
} from 'src/modules/options/infras/repo/postgres/dto';
import {
  variantModelName,
  VariantPersistence,
} from 'src/modules/variant/infras/repo/postgres/dto';
import {
  productSellableModelName,
  ProductSellablePersistence,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import {
  imageModelName,
  ImagePersistence,
} from 'src/infras/repository/image/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';

export class PostgresOptionRepository implements IOptionRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async get(id: string, condition: OptionConditionDTO): Promise<Option> {
    const option = await this.sequelize.models[this.modelName].findByPk(id);
    return option?.dataValues;
  }
  async list(
    paging: PagingDTO,
    condition: OptionConditionDTO
  ): Promise<ListResponse<Option[]>> {
    const include: Includeable[] = [];
    const optionValueInclude: Includeable[] = [];
    const variantInclude: Includeable[] = [];
    const variantWhere: WhereOptions = {};
    if (condition.include_option_values) {
      if (condition.include_variant) {
        if (condition.include_variant_info) {
          variantInclude.push({
            model: ProductSellablePersistence,
            as: productSellableModelName.toLowerCase(),
            include: [
              {
                model: ImagePersistence,
                as: imageModelName.toLowerCase(),
                attributes: {
                  exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'],
                },
                through: { attributes: [] },
              },
            ],
          });
        }
          if (condition.product_id) {
            variantWhere.product_id = condition.product_id;
          }
        optionValueInclude.push({
          model: VariantPersistence,
          as: variantModelName.toLowerCase(),
          through: { attributes: [] },
          include: variantInclude,
          // where: variantWhere
        });
      }
      include.push({
        model: OptionValuePersistence,
        as: optionValueModelName,
        include: optionValueInclude,
      });
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
      include,
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
  async insert(data: OptionCreateDTO): Promise<Option> {
    const result = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return result?.dataValues;
  }
  async update(id: string, data: OptionUpdateDTO): Promise<Option> {
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

export class PostgresOptionValueRepository implements IOptionValueRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async get(
    id: string,
    condition?: OptionValueConditionDTO
  ): Promise<OptionValue> {
    const optionValue = await this.sequelize.models[this.modelName].findByPk(
      id
    );
    return optionValue?.dataValues;
  }
  async list(
    paging: PagingDTO,
    condition?: OptionValueConditionDTO
  ): Promise<ListResponse<OptionValue[]>> {
    const { page, limit } = paging;
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
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
  async insert(data: OptionValueCreateDTO): Promise<OptionValue> {
    const result = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return result?.dataValues;
  }
  async update(id: string, data: OptionValueUpdateDTO): Promise<OptionValue> {
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
