import {
  CategoryConditionDTOSchema,
  CategoryCreateDTOSchema,
  CategoryUpdateDTOSchema,
} from '@models/category/category.dto';
import { Category } from '@models/category/category.model';
import { Meta, PagingDTO } from 'src/share/models/paging';

export interface ICategoryUseCase {
  createCategory(data: CategoryCreateDTOSchema): Promise<Category>;
  updateCategory(id: string, data: CategoryUpdateDTOSchema): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;
  getCategory(id: string): Promise<Category | null>;
  listCategory(
    paging: PagingDTO,
    condition: CategoryConditionDTOSchema
  ): Promise<{ data: Category[]; meta: Meta }>;
}

export interface ICategoryRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  get(id: string): Promise<Category | null>;
  list(
    paging: PagingDTO,
    condition: CategoryConditionDTOSchema
  ): Promise<{ data: Category[]; meta: Meta }>;
}

export interface ICommandRepository {
  insert(data: CategoryCreateDTOSchema): Promise<Category>;
  update(id: string, data: CategoryUpdateDTOSchema): Promise<Category>;
  delete(id: string): Promise<boolean>;
}
