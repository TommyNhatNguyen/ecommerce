import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductUpdateDTOSchema,
} from '@models/product/product.dto';
import { Product } from '@models/product/product.model';
import { ListResponse } from 'src/share/models/base-model';
import { Meta, PagingDTO } from 'src/share/models/paging';
export interface IProductUseCase {
  createNewProduct(data: ProductCreateDTOSchema): Promise<Product>;
  updateProduct(id: string, data: ProductUpdateDTOSchema): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  getProducts(condition: ProductConditionDTOSchema, paging: PagingDTO): Promise<ListResponse<Product[]>>;
  getProductById(id: string, condition?: ProductConditionDTOSchema): Promise<Product | null>;
}

export interface IProductRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  get(id: string, condition?: ProductConditionDTOSchema): Promise<Product | null>;
  list(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<ListResponse<Product[]>>;
}

export interface ICommandRepository {
  insert(data: ProductCreateDTOSchema): Promise<Product>;
  update(id: string, data: ProductUpdateDTOSchema): Promise<Product>;
  delete(id: string): Promise<boolean>;
}
