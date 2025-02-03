import { Request, Response } from 'express';
import {
  ProductSellableConditionDTOSchema,
  ProductSellableCreateDTOSchema,
  ProductSellableUpdateDTOSchema,
} from 'src/modules/product_sellable/models/product-sellable.dto';
import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class ProductSellableHttpService {
  constructor(
    private readonly productSellableUseCase: IProductSellableUseCase
  ) {}

  async createNewProductSellable(req: Request, res: Response) {
    const { success, data, error } = ProductSellableCreateDTOSchema.omit({
      total_discounts: true,
      price_after_discounts: true,
    }).safeParse(req.body);
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }
    try {
      const result = await this.productSellableUseCase.createNewProductSellable(
        data
      );
      res.status(200).json({
        message: 'Product created successfully',
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }

  async updateProductSellable(req: Request, res: Response) {
    const { success, data, error } = ProductSellableUpdateDTOSchema.safeParse(
      req.body
    );
    const { id } = req.params;
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (!id) {
      res.status(400).json({ error: 'Id is required' });
      return;
    }

    try {
      const product = await this.productSellableUseCase.getProductSellableById(
        id
      );
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      const result = await this.productSellableUseCase.updateProductSellable(
        id,
        data
      );
      res.status(200).json({
        message: 'Product updated successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }

  async deleteProductSellable(req: Request, res: Response) {
    const { id } = req.params;
    console.log(id);
    if (!id) {
      res.status(400).json({ error: 'Id is required' });
      return;
    }

    try {
      const product = await this.productSellableUseCase.getProductSellableById(
        id,
        {
          includeImage: true,
        }
      );
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      const result = await this.productSellableUseCase.deleteProductSellable(
        id
      );
      res.status(200).json({
        message: 'Product deleted successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }

  async getProductSellables(req: Request, res: Response) {
    const {
      success: pagingSuccess,
      data: paging,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: conditionSuccess,
      data: condition,
      error: conditionError,
    } = ProductSellableConditionDTOSchema.safeParse(req.query);
    if (!pagingSuccess || !conditionSuccess) {
      res
        .status(400)
        .json({ error: pagingError?.message || conditionError?.message });
      return;
    }

    try {
      const result = await this.productSellableUseCase.getProductSellables(
        condition,
        paging
      );
      res.status(200).json({
        message: 'Products fetched successfully',
        ...result,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
      return;
    }
  }

  async getProductSellableById(req: Request, res: Response) {
    const { id } = req.params;
    const {
      success: conditionSuccess,
      data: condition,
      error: conditionError,
    } = ProductSellableConditionDTOSchema.safeParse(req.query);
    if (!id || !conditionSuccess) {
      res.status(400).json({ error: 'Id is required' });
      return;
    }
    try {
      const result = await this.productSellableUseCase.getProductSellableById(
        id,
        condition
      );
      if (!result) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.status(200).json({
        message: 'Product fetched successfully',
        ...result,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }
}
