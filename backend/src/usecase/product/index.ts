import { IImageCloudinaryRepository } from '@models/image/image.interface';
import { IInventoryRepository } from '@models/inventory/inventory.interface';
import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductGetStatsDTO,
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
  constructor(
    private readonly repository: IProductRepository,
    private readonly cloudinaryImageRepository: IImageCloudinaryRepository
  ) {}
  async getTotalInventoryByGroup(condition?: ProductGetStatsDTO): Promise<any> {
    return await this.repository.getTotalInventoryByGroup(condition);
  }
  async countTotalProduct(): Promise<number> {
    return await this.repository.countTotalProduct();
  }
  async updateProduct(
    id: string,
    data: ProductUpdateDTOSchema
  ): Promise<Product> {
    return await this.repository.update(id, data);
  }
  async deleteProduct(id: string): Promise<boolean> {
    const product = await this.repository.get(id, { includeImage: true });
    if (product?.image?.length && product.image.length > 0) {
      await Promise.all(
        product.image.map(async (image) => {
          await this.cloudinaryImageRepository.delete(image.cloudinary_id);
        })
      );
    }
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
