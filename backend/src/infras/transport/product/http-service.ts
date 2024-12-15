
import { ProductCreateDTOSchema } from '@models/product/product.dto';
import { IProductUseCase } from '@models/product/product.interface';
import { Request, Response } from 'express';

export class ProductHttpService {
  constructor(private readonly productUseCase: IProductUseCase) {}

  async createNewProduct(req: Request, res: Response) {
    const { success, data, error } = ProductCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }

    const result = await this.productUseCase.createNewProduct(data);
    res.status(200).json({
      message: 'Product created successfully',
      data: result,
    });
  }
}
