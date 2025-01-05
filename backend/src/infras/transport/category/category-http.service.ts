import {
  CategoryConditionDTOSchema,
  CategoryCreateDTOSchema,
  CategoryUpdateDTOSchema,
} from '@models/category/category.dto';
import { ICategoryUseCase } from '@models/category/category.interface';
import { Request, Response } from 'express';
import { PagingDTOSchema } from 'src/share/models/paging';

export class CategoryHttpService {
  constructor(private readonly useCase: ICategoryUseCase) {}

  async createNewCategory(req: Request, res: Response) {
    const { success, data, error } = CategoryCreateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const category = await this.useCase.createCategory(data);
      res
        .status(200)
        .json({ message: 'Category created successfully', data: category });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create category' });
      return;
    }
  }
  async updateCategory(req: Request, res: Response) {
    const { success, data, error } = CategoryUpdateDTOSchema.safeParse(
      req.body
    );
    const { id } = req.params;
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    const category = await this.useCase.getCategory(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    try {
      const updatedCategory = await this.useCase.updateCategory(id, data);
      res.status(200).json({
        message: 'Category updated successfully',
        data: updatedCategory,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update category' });
      return;
    }
  }
  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    const category = await this.useCase.getCategory(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    try {
      await this.useCase.deleteCategory(id);
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete category' });
      return;
    }
  }
  async getCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CategoryConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const category = await this.useCase.getCategory(id, data);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.status(200).json({ message: 'Category found', ...category });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get category' });
      return;
    }
  }
  async listCategory(req: Request, res: Response) {
    const {
      success: pagingSuccess,
      data: pagingData,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: conditionSuccess,
      data: conditionData,
      error: conditionError,
    } = CategoryConditionDTOSchema.safeParse(req.body);

    if (!pagingSuccess || !conditionSuccess) {
      res.status(400).json({ message: pagingError?.message });
      return;
    }
    try {
      const categories = await this.useCase.listCategory(
        pagingData,
        conditionData
      );

      res.status(200).json({ message: 'Categories found', ...categories });
    } catch (error) {
      res.status(500).json({ message: 'Failed to list categories' });
      return;
    }
  }
}
