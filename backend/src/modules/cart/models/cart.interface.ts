import { Transaction } from "sequelize";
import {
  CartAddNewProductsDTO,
  CartAddProductsSellableDTO,
  CartCreateDTO,
  CartUpdateDTO,
  CartUpdateProductDTO,
  CartUpdateProductSellableDTO,
} from "src/modules/cart/models/cart.dto";
import { CartConditionDTO } from "src/modules/cart/models/cart.dto";
import { Cart } from "src/modules/cart/models/cart.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export interface ICartUseCase {
  getById(id: string, condition: CartConditionDTO): Promise<Cart>;
  getList(
    paging: PagingDTO,
    condition: CartConditionDTO
  ): Promise<ListResponse<Cart[]>>;
  create(data: CartCreateDTO, t?: Transaction): Promise<Cart>;
  update(id: string, data: CartUpdateDTO): Promise<Cart>;
  delete(id: string): Promise<boolean>;
  addProductsToCart(
    products_cart: CartAddNewProductsDTO
  ): Promise<Cart>;
  updateProductOnCart(
    products_cart: CartUpdateProductDTO,
    condition?: CartConditionDTO
  ): Promise<Cart>;
}

export interface ICartRepository extends IQueryRepository, ICommandRepository {
  addProducts(data: CartAddProductsSellableDTO): Promise<boolean>;
  updateProducts(data: CartUpdateProductSellableDTO): Promise<boolean>;
}

export interface IQueryRepository {
  getById(id: string, condition: CartConditionDTO): Promise<Cart>;
  getList(
    paging: PagingDTO,
    condition: CartConditionDTO
  ): Promise<ListResponse<Cart[]>>;
}

export interface ICommandRepository {
  create(data: CartCreateDTO, t?: Transaction): Promise<Cart>;
  update(id: string, data: CartUpdateDTO): Promise<Cart>;
  delete(id: string): Promise<boolean>;
}
