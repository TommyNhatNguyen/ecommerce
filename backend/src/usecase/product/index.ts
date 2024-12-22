import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductUpdateDTOSchema,
} from '@models/product/product.dto';
import {
  IProductRepository,
  IProductUseCase,
} from '@models/product/product.interface';
import { Product } from '@models/product/product.model';
import { ListResponse, ModelStatus } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { v7 as uuidv7 } from 'uuid';

export class ProductUseCase implements IProductUseCase {
  constructor(private readonly repository: IProductRepository) {}
  async updateProduct(
    id: string,
    data: ProductUpdateDTOSchema
  ): Promise<Product> {
    return await this.repository.update(id, data);
  }
  async deleteProduct(id: string): Promise<boolean> {
    await this.repository.delete(id);
    return true;
  }
  async getProducts(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<ListResponse<Product[]>> {
    const data = await this.repository.list(condition, paging);
    return data;
  }
  async getProductById(
    id: string,
    condition: ProductConditionDTOSchema
  ): Promise<Product | null> {
    return await this.repository.get(id, condition);
  }

  async createNewProduct(data: ProductCreateDTOSchema): Promise<Product> {
    return await this.repository.insert(data);
  }
}
