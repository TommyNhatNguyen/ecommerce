import { CategoryCreateDTOSchema } from '@models/category/category.dto';
import {
  ICategoryRepository,
  ICategoryUseCase,
} from '@models/category/category.interface';
import { Category } from '@models/category/category.model';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';
export class CategoryUseCase implements ICategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}
  async createCategory(data: CategoryCreateDTOSchema): Promise<Category> {
    const newId = uuidv7();
    const category: Category = {
      ...data,
      id: newId,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
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
