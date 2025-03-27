import { CategoryConditionDTOSchema, CategoryCreateDTOSchema, CategoryUpdateDTOSchema } from 'src/modules/category/models/category.dto';
import { ICategoryUseCase } from 'src/modules/category/models/category.interface';
import { ICategoryRepository } from 'src/modules/category/models/category.interface';
import { Category } from 'src/modules/category/models/category.model';
import { IImageCloudinaryRepository } from 'src/modules/image/models/image.interface';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
  ModelStatus,
} from 'src/share/models/base-model';
import { PagingDTO, Meta } from 'src/share/models/paging';
import { v7 as uuidv7 } from 'uuid';
export class CategoryUseCase implements ICategoryUseCase {
  constructor(
    private readonly repository: ICategoryRepository,
    private readonly cloudinaryImageRepository: IImageCloudinaryRepository
  ) {}
  async bulkDelete(ids: string[]): Promise<boolean> {
    return await this.repository.bulkDelete(ids);
  }
  async updateCategory(
    id: string,
    data: CategoryUpdateDTOSchema
  ): Promise<Category> {
    const updatedCategory = await this.repository.get(id, {
      include_image: true,
      order: BaseOrder.DESC,
      sortBy: BaseSortBy.CREATED_AT,
    });
    if (updatedCategory?.image) {
      await this.cloudinaryImageRepository.delete(
        updatedCategory.image.cloudinary_id
      );
    }
    const category = await this.repository.update(id, data);
    return category;
  }
  async deleteCategory(id: string): Promise<boolean> {
    const category = await this.repository.get(id, {
      include_image: true,
      order: BaseOrder.DESC,
      sortBy: BaseSortBy.CREATED_AT,
    });
    if (category?.image) {
      await this.cloudinaryImageRepository.delete(category.image.cloudinary_id);
    }
    await this.repository.delete(id);
    return true;
  }
  async getCategory(
    id: string,
    condition: CategoryConditionDTOSchema
  ): Promise<Category | null> {
    const category = await this.repository.get(id, condition);
    return category;
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
