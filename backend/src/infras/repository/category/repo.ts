import {
  CategoryConditionDTOSchema,
  CategoryCreateDTOSchema,
  CategoryUpdateDTOSchema,
} from '@models/category/category.dto';
import { ICategoryRepository } from '@models/category/category.interface';
import { Category } from '@models/category/category.model';
import { Op, Sequelize, where } from 'sequelize';
import {
  productModelName,
  ProductPersistence,
} from 'src/infras/repository/product/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { Meta, PagingDTO } from 'src/share/models/paging';

class PostgresCategoryRepository implements ICategoryRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async get(
    id: string,
    condition: CategoryConditionDTOSchema
  ): Promise<Category | null> {
    const include: any = [];
    if (condition?.include_products) {
      include.push({
        model: ProductPersistence,
        as: productModelName,
        attributes: {
          exclude: EXCLUDE_ATTRIBUTES,
        },
        through: {
          attributes: [],
        },
      });
    }
    const data = await this.sequelize.models[this.modelName].findByPk(id, {
      include: include,
    });
    return data ? data.dataValues : null;
  }
  async list(
    paging: PagingDTO,
    condition: CategoryConditionDTOSchema
  ): Promise<ListResponse<Category[]>> {
    const { page, limit } = paging;
    console.log(paging);
    const where: any = {};
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    if (condition.name) {
      where.name = {
        [Op.iLike]: condition.name,
      };
    }
    if (condition.status) {
      where.status = condition.status;
    }
    if (condition.created_at) {
      where.created_at = {
        [Op.gte]: condition.created_at,
      };
    }
    if (condition.updated_at) {
      where.updated_at = {
        [Op.gte]: condition.updated_at,
      };
    }
    if (condition?.include_products) {
      const { rows, count } = await this.sequelize.models[
        this.modelName
      ].findAndCountAll({
        where: where,
        limit,
        offset: (page - 1) * limit,
        order: [[sortBy, order]],
        distinct: true,
        include: {
          model: ProductPersistence,
          as: productModelName,
          attributes: {
            exclude: EXCLUDE_ATTRIBUTES,
          },
          through: {
            attributes: [],
          },
        },
      });
      return {
        data: rows as unknown as Category[],
        meta: {
          limit,
          total_count: count,
          current_page: page,
          total_page: Math.ceil(count / limit),
        },
      };
    } else {
      const { rows, count } = await this.sequelize.models[
        this.modelName
      ].findAndCountAll({
        where: where,
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
  }
  async insert(data: CategoryCreateDTOSchema): Promise<Category> {
    const result = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return result.dataValues;
  }
  async update(id: string, data: CategoryUpdateDTOSchema): Promise<Category> {
    const result = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return result[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
}

export default PostgresCategoryRepository;
