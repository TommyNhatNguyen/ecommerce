import { CartAddNewProductsDTO, CartAddProductsDTO, CartCreateDTO, CartUpdateDTO } from 'src/modules/cart/models/cart.dto';
import { CartConditionDTO } from 'src/modules/cart/models/cart.dto';
import { Cart } from 'src/modules/cart/models/cart.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface ICartUseCase {
  getById(id: string, condition: CartConditionDTO): Promise<Cart>;
  getList(
    paging: PagingDTO,
    condition: CartConditionDTO
  ): Promise<ListResponse<Cart[]>>;
  create(data: CartCreateDTO): Promise<Cart>;
  update(id: string, data: CartUpdateDTO): Promise<Cart>;
  delete(id: string): Promise<boolean>;
  addProductsToCart(
    cartId: string,
    products_cart: CartAddNewProductsDTO
  ): Promise<Cart>;
}

export interface ICartRepository extends IQueryRepository, ICommandRepository {
  addProducts(data: CartAddProductsDTO[]): Promise<boolean>;
}

export interface IQueryRepository {
  getById(id: string, condition: CartConditionDTO): Promise<Cart>;
  getList(
    paging: PagingDTO,
    condition: CartConditionDTO
  ): Promise<ListResponse<Cart[]>>;
}

export interface ICommandRepository {
  create(data: CartCreateDTO): Promise<Cart>;
  update(id: string, data: CartUpdateDTO): Promise<Cart>;
  delete(id: string): Promise<boolean>;
}
