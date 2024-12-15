import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductUpdateDTOSchema,
} from '@models/product/product.dto';
import { Product } from '@models/product/product.model';
import { PagingDTO } from 'src/share/models/paging';
export interface IProductUseCase {
  createNewProduct(data: ProductCreateDTOSchema): Promise<Product>;
}

export interface IProductRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  get(id: string): Promise<Product | null>;
  list(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<Product[]>;
}

export interface ICommandRepository {
  insert(data: Product): Promise<boolean>;
  update(id: string, data: ProductUpdateDTOSchema): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
