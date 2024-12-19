import { IProductRepository } from '@models/product/product.interface';
import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductUpdateDTOSchema,
} from '@models/product/product.dto';
import { Product } from '@models/product/product.model';
import { Meta, PagingDTO } from 'src/share/models/paging';
import { Sequelize } from 'sequelize';
import { Model } from 'sequelize';
import {
  categoryModelName,
  CategoryPersistence,
} from 'src/infras/repository/category/dto';
import { attribute } from '@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
  ModelStatus,
} from 'src/share/models/base-model';
import { Op } from 'sequelize';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { productCategoryModelName } from 'src/infras/repository/product/dto';
// implement cho ORM
export class PostgresProductRepository implements IProductRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  get(id: string): Promise<Product | null> {
    return this.sequelize.models[this.modelName].findByPk(id, {
      include: {
        model: CategoryPersistence,
        as: categoryModelName,
        required: true,
        attributes: {
          exclude: EXCLUDE_ATTRIBUTES,
        },
        through: {
          attributes: [],
        },
      },
    }) as Promise<Product | null>;
  }
  async list(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<ListResponse<Product[]>> {
    const { page, limit } = paging;
    let where: any = {};
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    if (condition.maxPrice) {
      where.price = {
        [Op.lte]: condition.maxPrice,
      };
    }
    if (condition.minPrice) {
      where.price = {
        ...where.price,
        [Op.gte]: condition.minPrice,
      };
    }
    if (condition.name) {
      where.name = {
        [Op.iLike]: condition.name,
      };
    }
    if (condition.status) {
      where.status = condition.status;
    }
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
      distinct: true,
      include: {
        model: CategoryPersistence,
        as: categoryModelName,
        required: true,
        attributes: {
          exclude: EXCLUDE_ATTRIBUTES,
        },
        through: {
          attributes: [],
        },
      },
    });
    return {
      data: rows as unknown as Product[],
      meta: {
        limit,
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async insert(data: ProductCreateDTOSchema): Promise<Product> {
    const { categoryIds, ...rest } = data;
    const result = await this.sequelize.models[this.modelName].create(data, {
      include: {
        model: CategoryPersistence,
        as: categoryModelName,
        required: true,
        attributes: {
          exclude: EXCLUDE_ATTRIBUTES,
        },
        through: {
          attributes: [],
        },
      },
      returning: true,
    });
    console.log(result);
    const insertedProduct = result.dataValues;
    if (categoryIds) {
      await this.sequelize.models[productCategoryModelName].bulkCreate(
        categoryIds.map((id) => ({ product_id: rest.id, category_id: id }))
      );
    }
    return insertedProduct as Product;
  }
  async update(id: string, data: ProductUpdateDTOSchema): Promise<Product> {
    const result = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    const updatedProduct = result[1][0].dataValues;
    return updatedProduct as unknown as Product;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
}
