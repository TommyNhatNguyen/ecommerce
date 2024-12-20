import {
  CategoryConditionDTOSchema,
  CategoryCreateDTOSchema,
  CategoryUpdateDTOSchema,
} from '@models/category/category.dto';
import {
  ICategoryRepository,
  ICategoryUseCase,
} from '@models/category/category.interface';
import { Category } from '@models/category/category.model';
import { ListResponse, ModelStatus } from 'src/share/models/base-model';
import { PagingDTO, Meta } from 'src/share/models/paging';
import { v7 as uuidv7 } from 'uuid';
export class CategoryUseCase implements ICategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}
  async updateCategory(
    id: string,
    data: CategoryUpdateDTOSchema
  ): Promise<Category> {
    const category = await this.repository.update(id, data);
    return category;
  }
  async deleteCategory(id: string): Promise<boolean> {
    await this.repository.delete(id);
    return true;
  }
  async getCategory(
    id: string,
    condition: CategoryConditionDTOSchema
  ): Promise<Category | null> {
    return await this.repository.get(id, condition);
  }
  async listCategory(
    paging: PagingDTO,
    condition: CategoryConditionDTOSchema
  ): Promise<ListResponse<Category[]>> {
    return await this.repository.list(paging, condition);
  }
  async createCategory(data: CategoryCreateDTOSchema): Promise<Category> {
    const newId = uuidv7();
    const category: Category = {
      ...data,
      id: newId,
      status: ModelStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };
    try {
      const result = await this.repository.insert(category);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
