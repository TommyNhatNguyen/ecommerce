import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { ICartUseCase } from 'src/modules/cart/models/cart.interface';
import { ICartRepository } from 'src/modules/cart/models/cart.interface';
import {
  CartAddNewProductsDTO,
  CartAddProductsDTO,
  CartConditionDTO,
  CartCreateDTO,
  CartUpdateDTO,
} from 'src/modules/cart/models/cart.dto';
import { Cart } from 'src/modules/cart/models/cart.model';
import { CART_PRODUCT_ERROR } from 'src/modules/cart/models/cart.error';
import { IProductUseCase } from 'src/modules/products/product/product.interface';

export class CartUseCase implements ICartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly cartProductRepository: ICartRepository,
    private readonly productUseCase: IProductUseCase
  ) {}
  async getById(id: string, condition: CartConditionDTO): Promise<Cart> {
    return await this.cartRepository.getById(id, condition);
  }
  async getList(
    paging: PagingDTO,
    condition: CartConditionDTO
  ): Promise<ListResponse<Cart[]>> {
    return await this.cartRepository.getList(paging, condition);
  }
  async create(data: CartCreateDTO): Promise<Cart> {
    return await this.cartRepository.create(data);
  }
  async update(id: string, data: CartUpdateDTO): Promise<Cart> {
    return await this.cartRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.cartRepository.delete(id);
  }
  async addProductsToCart(
    cartId: string,
    products_cart: CartAddNewProductsDTO
  ): Promise<Cart> {
    let productCarts: CartAddProductsDTO[] = [];
    // --- PRODUCTS ---
    if (products_cart.length === 0) throw CART_PRODUCT_ERROR;
    const products = await this.productUseCase.getProducts(
      {
        ids: products_cart.map((product) => product.id),
      },
      { page: 1, limit: products_cart.length }
    );
    if (products.data.length !== products_cart.length) throw CART_PRODUCT_ERROR;
    products.data.forEach((product) => {
      productCarts.push({
        cart_id: cartId,
        product_id: product.id,
        quantity:
          products_cart.find((product_cart) => product_cart.id === product.id)
            ?.quantity ?? 0,
        subtotal:
          product.price *
          (products_cart.find((product_cart) => product_cart.id === product.id)
            ?.quantity || 0),
        discount_amount: 0,
        total:
          product.price *
          (products_cart.find((product_cart) => product_cart.id === product.id)
            ?.quantity || 0),
      });
    });
    await this.cartProductRepository.addProducts(productCarts);
    return await this.cartRepository.getById(cartId, {});
  }
}
