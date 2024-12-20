import { IProductRepository } from '@models/product/product.interface';
import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductUpdateDTOSchema,
} from '@models/product/product.dto';
import { Product } from '@models/product/product.model';
import { PagingDTO } from 'src/share/models/paging';
import { Sequelize, Op } from 'sequelize';
import {
  categoryModelName,
  CategoryPersistence,
} from 'src/infras/repository/category/dto';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import {
  productCategoryModelName,
  productDiscountModelName,
  ProductDiscountPersistence,
} from 'src/infras/repository/product/dto';
import {
  discountModelName,
  DiscountPersistence,
} from 'src/infras/repository/discount/dto';

export class PostgresProductRepository implements IProductRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async get(
    id: string,
    condition?: ProductConditionDTOSchema
  ): Promise<Product | null> {
    const include: any[] = [];
    if (condition?.includeDiscount) {
      include.push({
        model: DiscountPersistence,
        as: discountModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
      });
    }
    if (condition?.includeCategory) {
      include.push({
        model: CategoryPersistence,
        as: categoryModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
      });
    }
    const data = await this.sequelize.models[this.modelName].findByPk(id, {
      include,
    });
    return data ? data.dataValues : null;
  }

  async list(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<ListResponse<Product[]>> {
    const { page, limit } = paging;
    const where: any = {};
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;

    if (condition.maxPrice) where.price = { [Op.lte]: condition.maxPrice };
    if (condition.minPrice)
      where.price = { ...where.price, [Op.gte]: condition.minPrice };
    if (condition.name) where.name = { [Op.iLike]: condition.name };
    if (condition.status) where.status = condition.status;

    const include: any[] = [];
    if (condition.includeDiscount) {
      include.push({
        model: DiscountPersistence,
        as: discountModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
      });
    }
    if (condition.includeCategory) {
      include.push({
        model: CategoryPersistence,
        as: categoryModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
      });
    }

    const { rows: productRows, count: countRows } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
      distinct: true,
      include,
    });

    const rows = productRows.map((row) => row.dataValues);
    const count = countRows;

    return {
      data: rows,
      meta: {
        limit,
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
      },
    };
  }

  async insert(data: ProductCreateDTOSchema): Promise<Product> {
    const { categoryIds, discountIds, ...rest } = data;
    const result = await this.sequelize.models[this.modelName].create(data, {
      include: [
        {
          model: CategoryPersistence,
          as: categoryModelName,
          attributes: { exclude: EXCLUDE_ATTRIBUTES },
          through: { attributes: [] },
        },
        {
          model: ProductDiscountPersistence,
          as: productDiscountModelName,
          attributes: { exclude: EXCLUDE_ATTRIBUTES },
          through: { attributes: [] },
        },
      ],
      returning: true,
    });

    const insertedProduct = result.dataValues;
    if (categoryIds) {
      await this.sequelize.models[productCategoryModelName].bulkCreate(
        categoryIds.map((id) => ({ product_id: rest.id, category_id: id }))
      );
    }
    if (discountIds) {
      await this.sequelize.models[productDiscountModelName].bulkCreate(
        discountIds.map((id) => ({ product_id: rest.id, discount_id: id }))
      );
    }
    return insertedProduct as Product;
  }

  async update(id: string, data: ProductUpdateDTOSchema): Promise<Product> {
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
