import {
  CategoryConditionDTOSchema,
  CategoryCreateDTOSchema,
  CategoryUpdateDTOSchema,
} from '@models/category/category.dto';
import { ICategoryRepository } from '@models/category/category.interface';
import { Category } from '@models/category/category.model';
import { Sequelize } from 'sequelize';
import { Meta, PagingDTO } from 'src/share/models/paging';

class PostgresCategoryRepository implements ICategoryRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  get(id: string): Promise<Category | null> {
    return this.sequelize.models[this.modelName].findByPk(
      id
    ) as Promise<Category | null>;
  }
  async list(
    paging: PagingDTO,
    condition: CategoryConditionDTOSchema
  ): Promise<{ data: Category[]; meta: Meta }> {
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: condition,
      limit,
      offset: (page - 1) * limit,
      order: [['updated_at', 'DESC']],
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
    return result[1][0].dataValues as Category;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
}

export default PostgresCategoryRepository;
