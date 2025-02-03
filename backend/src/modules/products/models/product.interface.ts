import {
  ProductCategoryCreateDTO,
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductUpdateDTOSchema,
} from "./product.dto";
import { Product } from "./product.model";
import { ListResponse } from "src/share/models/base-model";
import { Meta, PagingDTO } from "src/share/models/paging";
export interface IProductUseCase {
  createNewProduct(
    data: Omit<
      ProductCreateDTOSchema,
      "total_discounts" | "price_after_discounts"
    >
  ): Promise<Product>;
  updateProduct(id: string, data: ProductUpdateDTOSchema): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  getProducts(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<ListResponse<Product[]>>;
  getProductById(
    id: string,
    condition?: ProductConditionDTOSchema
  ): Promise<Product | null>;
  countTotalProduct(): Promise<number>;
}

export interface IProductRepository
  extends IQueryRepository,
    ICommandRepository {
  countTotalProduct(): Promise<number>;
  addCategories(data: ProductCategoryCreateDTO[]): Promise<boolean>;
}

export interface IQueryRepository {
  get(
    id: string,
    condition?: ProductConditionDTOSchema
  ): Promise<Product | null>;
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
