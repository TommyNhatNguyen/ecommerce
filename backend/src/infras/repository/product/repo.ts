import { IProductRepository } from '@models/product/product.interface';
import {
  ProductConditionDTOSchema,
  ProductUpdateDTOSchema,
} from '@models/product/product.dto';
import { Product } from '@models/product/product.model';
import { PagingDTO } from 'src/share/models/paging';
import { Sequelize } from 'sequelize';
// implement cho ORM
export class PostgresProductRepository implements IProductRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  get(id: string): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }
  list(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
  async insert(data: Product): Promise<boolean> {
    const result = await this.sequelize.models[this.modelName].create(data);
    return true;
  }
  update(id: string, data: ProductUpdateDTOSchema): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
