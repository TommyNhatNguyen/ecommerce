
import { ProductConditionDTOSchema, ProductCreateDTOSchema, ProductUpdateDTOSchema } from '@models/product/product.dto';
import { IProductUseCase } from '@models/product/product.interface';
import { Request, Response } from 'express';
import { PagingDTOSchema } from 'src/share/models/paging';

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

  async updateProduct(req: Request, res: Response) {
    const {success, data, error} = ProductUpdateDTOSchema.safeParse(req.body);
    const {id} = req.params;
    if (!success) {
      res.status(400).json({error: error.message});
      return;
    }

    if (!id) {
      res.status(400).json({error: 'Id is required'});
      return;
    }

    const product = await this.productUseCase.getProductById(id)
    if (!product) {
      res.status(404).json({error: 'Product not found'});
      return;
    }

    const result = await this.productUseCase.updateProduct(id, data)
    console.log(result)
    res.status(200).json({
      message: 'Product updated successfully',
      data: result,
    });
  }

  async deleteProduct(req: Request, res: Response) {
    const {id} = req.params;
    if (!id) {
      res.status(400).json({error: 'Id is required'});
      return;
    }
    const product = await this.productUseCase.getProductById(id)
    if (!product) {
      res.status(404).json({error: 'Product not found'});
      return;
    }
    const result = await this.productUseCase.deleteProduct(id)
    res.status(200).json({
      message: 'Product deleted successfully',
      data: result,
    });
  }

  async getProducts(req: Request, res: Response) {
    const { success: pagingSuccess, data : paging, error: pagingError } = PagingDTOSchema.safeParse(req.query);
    const condition = ProductConditionDTOSchema.parse(req.query);
    if (!pagingSuccess) {
      res.status(400).json({ error: pagingError.message });
      return;
    }
    const result = await this.productUseCase.getProducts(condition, paging)
    res.status(200).json({
      message: 'Products fetched successfully',
      data: result,
    });
  }

  async getProductById(req: Request, res: Response) {
    const {id} = req.params;
    if (!id) {
      res.status(400).json({error: 'Id is required'});
      return;
    }
    const result = await this.productUseCase.getProductById(id)
    if (!result) {
      res.status(404).json({error: 'Product not found'});
      return;
    }
    res.status(200).json({
      message: 'Product fetched successfully',
      data: result,
    });
  }
}
