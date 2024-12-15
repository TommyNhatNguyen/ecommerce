import {
  CategoryCreateDTOSchema,
  CategoryUpdateDTOSchema,
} from '@models/category/category.dto';
import { Category } from '@models/category/category.model';
import { PagingDTO } from 'src/share/models/paging';

export interface ICategoryUseCase {
  createCategory(data: CategoryCreateDTOSchema): Promise<Category>;
}

export interface ICategoryRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  get(id: string): Promise<Category | null>;
  list(paging: PagingDTO): Promise<Category[]>;
}

export interface ICommandRepository {
  insert(data: CategoryCreateDTOSchema): Promise<Category>;
  update(id: string, data: CategoryUpdateDTOSchema): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

