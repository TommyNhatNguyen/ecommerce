import {
  CategoryCreateDTOSchema,
  CategoryUpdateDTOSchema,
} from '@models/category/category.dto';
import { ICategoryRepository } from '@models/category/category.interface';
import { Category } from '@models/category/category.model';
import { Sequelize } from 'sequelize';
import { PagingDTO } from 'src/share/models/paging';

class PostgresCategoryRepository implements ICategoryRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  get(id: string): Promise<Category | null> {
    throw new Error('Method not implemented.');
  }
  list(paging: PagingDTO): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }
  async insert(data: CategoryCreateDTOSchema): Promise<Category> {
    try {
      const result = await this.sequelize.models[this.modelName].create(data);
      return result.toJSON() as Category;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  update(id: string, data: CategoryUpdateDTOSchema): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

export default PostgresCategoryRepository;
