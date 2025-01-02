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
import { IImageCloudinaryRepository } from '@models/image/image.interface';
import { BaseOrder, BaseSortBy, ListResponse, ModelStatus } from 'src/share/models/base-model';
import { PagingDTO, Meta } from 'src/share/models/paging';
import { v7 as uuidv7 } from 'uuid';
export class CategoryUseCase implements ICategoryUseCase {
  constructor(
    private readonly repository: ICategoryRepository,
    private readonly cloudinaryImageRepository: IImageCloudinaryRepository
  ) {}
  async updateCategory(
    id: string,
    data: CategoryUpdateDTOSchema
  ): Promise<Category> {
    const category = await this.repository.update(id, data);
    return category;
  }
  async deleteCategory(id: string): Promise<boolean> {
    const category = await this.repository.get(id, {
      include_image: true,
      order: BaseOrder.DESC,
      sortBy: BaseSortBy.CREATED_AT,
    });
    console.log("🚀 ~ CategoryUseCase ~ deleteCategory ~ category.image:", category)
    if (category?.image) {
      console.log("🚀 ~ CategoryUseCase ~ deleteCategory ~ category.image:", category.image)
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
