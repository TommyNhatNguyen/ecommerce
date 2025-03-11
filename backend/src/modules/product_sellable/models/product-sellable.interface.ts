import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  ProductSellableConditionDTO,
  ProductSellableCreateDTO,
  ProductSellableDiscountCreateDTO,
  ProductSellableImageCreateDTO,
  ProductSellableUpdateDTO,
  ProductSellableVariantCreateDTO,
} from './product-sellable.dto';
import { ProductSellable } from './product-sellable.model';
import { Transaction } from 'sequelize';
import { CronJob } from 'cron';

export interface IProductSellableUseCase {
  createNewProductSellable(
    data: Omit<
      ProductSellableCreateDTO,
      'total_discounts' | 'price_after_discounts'
    >,
    t?: Transaction
  ): Promise<ProductSellable>;
  updateProductSellable(
    id: string,
    data: ProductSellableUpdateDTO
  ): Promise<ProductSellable>;
  deleteProductSellable(id: string): Promise<boolean>;
  getProductSellables(
    condition: ProductSellableConditionDTO,
    paging?: PagingDTO
  ): Promise<ListResponse<ProductSellable[]>>;
  getProductSellableById(
    id: string,
    condition?: ProductSellableConditionDTO,
    t?: Transaction
  ): Promise<ProductSellable | null>;
  updateProductSellableDiscounts(
    t?: Transaction,
    noUpdateDiscountCount?: boolean
  ): Promise<boolean>;
}

export interface IProductSellableRepository
  extends IQueryRepository,
    ICommandRepository {
  addDiscounts(
    data: ProductSellableDiscountCreateDTO[],
    t?: Transaction
  ): Promise<boolean>;
  addImages(
    data: ProductSellableImageCreateDTO[],
    t?: Transaction
  ): Promise<boolean>;
  addVariants(
    data: ProductSellableVariantCreateDTO[],
    t?: Transaction
  ): Promise<boolean>;
}

export interface IQueryRepository {
  get(
    id: string,
    condition?: ProductSellableConditionDTO,
    t?: Transaction
  ): Promise<ProductSellable | null>;
  list(
    condition: ProductSellableConditionDTO,
    paging?: PagingDTO
  ): Promise<ListResponse<ProductSellable[]>>;
}

export interface ICommandRepository {
  insert(data: ProductSellableCreateDTO, t?: Transaction): Promise<ProductSellable>;
  update(id: string, data: ProductSellableUpdateDTO, t?: Transaction): Promise<ProductSellable>;
  delete(id: string): Promise<boolean>;
}
