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
import { CategoryPersistence } from 'src/infras/repository/category/dto';
import { attribute } from '@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js';
// implement cho ORM
export class PostgresProductRepository implements IProductRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  get(id: string): Promise<Product | null> {
    return this.sequelize.models[this.modelName].findByPk(
      id
    ) as Promise<Product | null>;
  }
  async list(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<{ data: Product[]; meta: Meta }> {
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: condition,
      limit,
      offset: (page - 1) * limit,
      order: [['updated_at', 'DESC']],
      include: {
        model: CategoryPersistence,
        attributes: ['id', 'name', 'description'],
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
    const result = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    const insertedProduct = result.dataValues;
    return insertedProduct as unknown as Product;
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
