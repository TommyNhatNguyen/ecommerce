import { CategoryCreateDTOSchema, CategoryUpdateDTOSchema } from 'src/modules/category/models/category.dto';
import { CategoryConditionDTOSchema } from 'src/modules/category/models/category.dto';
import { Category } from 'src/modules/category/models/category.model';
import { ListResponse } from 'src/share/models/base-model';
import { Meta, PagingDTO } from 'src/share/models/paging';

export interface ICategoryUseCase {
  createCategory(data: CategoryCreateDTOSchema): Promise<Category>;
  updateCategory(id: string, data: CategoryUpdateDTOSchema): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;
  getCategory(
    id: string,
    condition?: CategoryConditionDTOSchema
  ): Promise<Category | null>;
  listCategory(
    paging: PagingDTO,
    condition: CategoryConditionDTOSchema
  ): Promise<ListResponse<Category[]>>;
  bulkDelete(ids: string[]): Promise<boolean>;  
}

export interface ICategoryRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  get(
    id: string,
    condition: CategoryConditionDTOSchema
  ): Promise<Category | null>;
  list(
    paging: PagingDTO,
    condition: CategoryConditionDTOSchema
  ): Promise<ListResponse<Category[]>>;

}

export interface ICommandRepository {
  insert(data: CategoryCreateDTOSchema): Promise<Category>;
  update(id: string, data: CategoryUpdateDTOSchema): Promise<Category>;
  delete(id: string): Promise<boolean>;
  bulkDelete(ids: string[]): Promise<boolean>;
}
