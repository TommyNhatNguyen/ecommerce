import { CategoryCreateDTOSchema } from '@models/category/category.dto';
import { ICategoryUseCase } from '@models/category/category.interface';
import { Request, Response } from 'express';

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
}
