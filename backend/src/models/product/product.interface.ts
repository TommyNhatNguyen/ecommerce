import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductUpdateDTOSchema,
} from '@models/product/product.dto';
import { Product } from '@models/product/product.model';
import { Meta, PagingDTO } from 'src/share/models/paging';
export interface IProductUseCase {
  createNewProduct(data: ProductCreateDTOSchema): Promise<Product>;
  updateProduct(id: string, data: ProductUpdateDTOSchema): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  getProducts(condition: ProductConditionDTOSchema, paging: PagingDTO): Promise<{data: Product[], meta: Meta}>;
  getProductById(id: string): Promise<Product | null>;
}

export interface IProductRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  get(id: string): Promise<Product | null>;
  list(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<{data: Product[], meta: Meta}>;
}

export interface ICommandRepository {
  insert(data: ProductCreateDTOSchema): Promise<Product>;
  update(id: string, data: ProductUpdateDTOSchema): Promise<Product>;
  delete(id: string): Promise<boolean>;
}
