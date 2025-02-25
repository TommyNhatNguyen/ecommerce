import { Transaction } from 'sequelize';
import { BlogsConditionDTOSchema } from 'src/modules/blogs/models/blogs.dto';
import {
  BlogsCreateDTOSchema,
  BlogsUpdateDTOSchema,
} from 'src/modules/blogs/models/blogs.dto';
import { Blogs } from 'src/modules/blogs/models/blogs.model';
import { ListResponse } from 'src/share/models/base-model';
import { Meta, PagingDTO } from 'src/share/models/paging';

export interface IBlogsUseCase {
  createBlogs(data: BlogsCreateDTOSchema, t?: Transaction): Promise<Blogs>;
  updateBlogs(
    id: string,
    data: BlogsUpdateDTOSchema,
    t?: Transaction
  ): Promise<Blogs>;
  deleteBlogs(id: string, t?: Transaction): Promise<boolean>;
  getBlogs(
    id: string,
    condition?: BlogsConditionDTOSchema,
    t?: Transaction
  ): Promise<Blogs | null>;
  listBlogs(
    paging: PagingDTO,
    condition?: BlogsConditionDTOSchema,
    t?: Transaction
  ): Promise<ListResponse<Blogs[]>>;
}

export interface IBlogsRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IBlogsRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  get(
    id: string,
    condition?: BlogsConditionDTOSchema,
    t?: Transaction
  ): Promise<Blogs | null>;
  list(
    paging: PagingDTO,
    condition?: BlogsConditionDTOSchema,
    t?: Transaction
  ): Promise<ListResponse<Blogs[]>>;
}

export interface ICommandRepository {
  insert(data: Omit<BlogsCreateDTOSchema, 'user_id'>, t?: Transaction): Promise<Blogs>;
  update(
    id: string,
    data: BlogsUpdateDTOSchema,
    t?: Transaction
  ): Promise<Blogs>;
  delete(id: string, t?: Transaction): Promise<boolean>;
}
