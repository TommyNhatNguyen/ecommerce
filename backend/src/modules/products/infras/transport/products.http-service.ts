import { Request, Response } from "express";
import {
  ProductBulkSoftDeleteDTOSchema,
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductGetStatsDTOSchema,
  ProductUpdateDTOSchema,
} from "src/modules/products/models/product.dto";
import { IProductUseCase } from "src/modules/products/models/product.interface";
import { PagingDTOSchema } from "src/share/models/paging";

export class ProductHttpService {
  constructor(private readonly productUseCase: IProductUseCase) {}

  async createNewProduct(req: Request, res: Response) {
    const { success, data, error } = ProductCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }
    try {
      const result = await this.productUseCase.createNewProduct(data);
      res.status(200).json({
        message: "Product created successfully",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }

  async updateProduct(req: Request, res: Response) {
    const { success, data, error } = ProductUpdateDTOSchema.safeParse(req.body);
    const { id } = req.params;
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (!id) {
      res.status(400).json({ error: "Id is required" });
      return;
    }

    try {
      const product = await this.productUseCase.getProductById(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      const result = await this.productUseCase.updateProduct(id, data);
      res.status(200).json({
        message: "Product updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }

  async bulkSoftDelete(req: Request, res: Response) {
    const { success, data, error } = ProductBulkSoftDeleteDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }
    try {
      const result = await this.productUseCase.bulkSoftDelete(data.ids);
      if (result) {
        res.status(200).json({
          message: "Products deleted successfully",
          data: result,
        });
      } else {
        res.status(400).json({ error: "Failed to delete products" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }
  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    console.log(id);
    if (!id) {
      res.status(400).json({ error: "Id is required" });
      return;
    }

    try {
      const product = await this.productUseCase.getProductById(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      const result = await this.productUseCase.deleteProduct(id);
      res.status(200).json({
        message: "Product deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }

  async getProducts(req: Request, res: Response) {
    const {
      success: pagingSuccess,
      data: paging,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: conditionSuccess,
      data: condition,
      error: conditionError,
    } = ProductConditionDTOSchema.safeParse(req.query);
    if (!pagingSuccess || !conditionSuccess) {
      res
        .status(400)
        .json({ error: pagingError?.message || conditionError?.message });
      return;
    }

    try {
      const result = await this.productUseCase.getProducts(condition, paging);
      res.status(200).json({
        message: "Products fetched successfully",
        ...result,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
      return;
    }
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    const {
      success: conditionSuccess,
      data: condition,
      error: conditionError,
    } = ProductConditionDTOSchema.safeParse(req.query);
    if (!id || !conditionSuccess) {
      res.status(400).json({ error: "Id is required" });
      return;
    }
    try {
      const result = await this.productUseCase.getProductById(id, condition);
      if (!result) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.status(200).json({
        message: "Product fetched successfully",
        ...result,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }

}
