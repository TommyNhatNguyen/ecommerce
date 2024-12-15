
import { ProductCreateDTOSchema } from '@models/product/product.dto';
import { IProductRepository, IProductUseCase } from '@models/product/product.interface';
import { Product } from '@models/product/product.model';
import { ModelStatus } from 'src/share/models/base-model';
import { v7 as uuidv7 } from 'uuid';

export class ProductUseCase implements IProductUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async createNewProduct(data: ProductCreateDTOSchema): Promise<Product> {
    const newId = uuidv7();
    const product: Product = {
      ...data,
      id: newId,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repository.insert(product);
    return product;
  }
}
