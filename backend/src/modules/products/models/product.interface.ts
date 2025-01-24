import {
  ProductCategoryCreateDTO,
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductDiscountCreateDTO,
  ProductGetStatsDTO,
  ProductImageCreateDTO,
  ProductUpdateDTOSchema,
  ProductVariantCreateDTO,
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
  getTotalInventoryByGroup(condition?: ProductGetStatsDTO): Promise<any>;
}

export interface IProductRepository
  extends IQueryRepository,
    ICommandRepository {
  countTotalProduct(): Promise<number>;
  getTotalInventoryByGroup(condition?: ProductGetStatsDTO): Promise<any>;
  addCategories(data: ProductCategoryCreateDTO[]): Promise<boolean>;
  addDiscounts(data: ProductDiscountCreateDTO[]): Promise<boolean>;
  addImages(data: ProductImageCreateDTO[]): Promise<boolean>;
  addVariants(data: ProductVariantCreateDTO[]): Promise<boolean>;
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
