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
    const { categoryIds } = condition;
    const data = await this.repository.list(condition, paging);
    // filter by categoryIds
    if (categoryIds && categoryIds?.length > 0) {
      const products = data.data.filter((product) => {
        return product.category?.some((item) => categoryIds.includes(item.id));
      });
      data.data = products;
    }

    return data;
  }
  async getProductById(id: string): Promise<Product | null> {
    return await this.repository.get(id);
  }

  async createNewProduct(data: ProductCreateDTOSchema): Promise<Product> {
    const newId = uuidv7();
    const product: Product = {
      ...data,
      id: newId,
      status: ModelStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return await this.repository.insert(product);
  }
}
