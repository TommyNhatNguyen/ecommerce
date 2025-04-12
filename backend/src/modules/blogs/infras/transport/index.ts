import { Request, Response } from 'express';
import {
  BlogsConditionDTOSchema,
  BlogsCreateDTOSchema,
  BlogsUpdateDTOSchema,
} from 'src/modules/blogs/models/blogs.dto';
import { IBlogsUseCase } from 'src/modules/blogs/models/blogs.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class BlogsHttpService {
  constructor(private readonly useCase: IBlogsUseCase) {}

  async createNewBlogs(req: Request, res: Response) {
    const { success, data, error } = BlogsCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const blogs = await this.useCase.createBlogs(data);
      res
        .status(200)
        .json({ message: 'Blogs created successfully', data: blogs });
    } catch (error) {
      console.log('🚀 ~ BlogsHttpService ~ createNewBlogs ~ error:', error);
      res.status(500).json({ message: 'Failed to create blogs' });
      return;
    }
  }
  async updateBlogs(req: Request, res: Response) {
    const { success, data, error } = BlogsUpdateDTOSchema.safeParse(req.body);
    const { id } = req.params;
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    const blogs = await this.useCase.getBlogs(id);
    if (!blogs) {
      res.status(404).json({ message: 'Blogs not found' });
      return;
    }
    try {
      const updatedBlogs = await this.useCase.updateBlogs(id, data);
      res.status(200).json({
        message: 'Blogs updated successfully',
        data: updatedBlogs,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update blogs' });
      return;
    }
  }
  async deleteBlogs(req: Request, res: Response) {
    const { id } = req.params;
    const blogs = await this.useCase.getBlogs(id);
    if (!blogs) {
      res.status(404).json({ message: 'Blogs not found' });
      return;
    }
    try {
      await this.useCase.deleteBlogs(id);
      res.status(200).json({ message: 'Blogs deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete blogs' });
      return;
    }
  }
  async getBlogs(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = BlogsConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const blogs = await this.useCase.getBlogs(id, data);
      if (!blogs) {
        res.status(404).json({ message: 'Blogs not found' });
        return;
      }
      res.status(200).json({ message: 'Blogs found', ...blogs });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get blogs' });
      return;
    }
  }
  async listBlogs(req: Request, res: Response) {
    const {
      success: pagingSuccess,
      data: pagingData,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: conditionSuccess,
      data: conditionData,
      error: conditionError,
    } = BlogsConditionDTOSchema.safeParse(req.query);

    if (!pagingSuccess || !conditionSuccess) {
      res.status(400).json({ message: pagingError?.message });
      return;
    }
    try {
      const blogs = await this.useCase.listBlogs(pagingData, conditionData);
      res.status(200).json({ message: 'Blogs found', ...blogs });
    } catch (error) {
      res.status(500).json({ message: 'Failed to list blogs' });
      return;
    }
  }
}
