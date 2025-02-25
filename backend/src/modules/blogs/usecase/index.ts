import {
  BlogsCreateDTOSchema,
  BlogsUpdateDTOSchema,
  BlogsConditionDTOSchema,
} from 'src/modules/blogs/models/blogs.dto';
import {
  IBlogsRepository,
  IBlogsUseCase,
} from 'src/modules/blogs/models/blogs.interface';
import { Blogs } from 'src/modules/blogs/models/blogs.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class BlogsUseCase implements IBlogsUseCase {
  constructor(private readonly blogsRepository: IBlogsRepository) {}
  async createBlogs(data: BlogsCreateDTOSchema): Promise<Blogs> {
    return await this.blogsRepository.insert(data);
  }
  async updateBlogs(id: string, data: BlogsUpdateDTOSchema): Promise<Blogs> {
    return await this.blogsRepository.update(id, data);
  }
  async deleteBlogs(id: string): Promise<boolean> {
    return await this.blogsRepository.delete(id);
  }
  async getBlogs(
    id: string,
    condition?: BlogsConditionDTOSchema
  ): Promise<Blogs | null> {
    return await this.blogsRepository.get(id, condition);
  }
  async listBlogs(
    paging: PagingDTO,
    condition: BlogsConditionDTOSchema
  ): Promise<ListResponse<Blogs[]>> {
    return await this.blogsRepository.list(paging, condition);
  }
}
