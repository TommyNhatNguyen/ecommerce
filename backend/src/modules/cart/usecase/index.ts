import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";
import { ICartUseCase } from "src/modules/cart/models/cart.interface";
import { ICartRepository } from "src/modules/cart/models/cart.interface";
import {
  CartAddNewProductsDTO,
  CartAddProductsDTO,
  CartConditionDTO,
  CartCreateDTO,
  CartUpdateDTO,
} from "src/modules/cart/models/cart.dto";
import { Cart } from "src/modules/cart/models/cart.model";
import { CART_PRODUCT_ERROR } from "src/modules/cart/models/cart.error";
import { IProductSellableUseCase } from "src/modules/product_sellable/models/product-sellable.interface";

export class CartUseCase implements ICartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly cartProductRepository: ICartRepository,
    private readonly productSellableUseCase: IProductSellableUseCase
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
    console.log("🚀 ~ CartUseCase ~ create ~ data:", data);
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
    const productSellable =
      await this.productSellableUseCase.getProductSellables(
        {
          ids: products_cart.map((product) => product.id),
        },
        { page: 1, limit: products_cart.length }
      );
    for (let i = 0; i < products_cart.length; i++) {
      const cart_product = products_cart[i];
      const product_data: CartAddProductsDTO = {
        cart_id: cartId,
        product_sellable_id: cart_product.id,
        quantity: cart_product.quantity,
        subtotal: 0,
        discount_amount: 0,
        total: 0,
      };
      let price = 0;
      let discount = 0;
      let price_after_discount = 0;
      if (productSellable && productSellable.data) {
        price =
          productSellable.data.find((product) => product.id == cart_product.id)
            ?.price || 0;
        discount =
          productSellable.data.find((product) => product.id == cart_product.id)
            ?.total_discounts || 0;
        price_after_discount =
          productSellable.data.find((product) => product.id == cart_product.id)
            ?.price_after_discounts || 0;
      }
      product_data.subtotal = price * product_data.quantity;
      product_data.discount_amount = discount * product_data.quantity;
      product_data.total = price_after_discount * product_data.quantity;
      productCarts.push(product_data);
    }
    await this.cartProductRepository.addProducts(productCarts);
    const data = await this.cartRepository.update(cartId, {
      product_quantity: products_cart.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      ),
      product_count: products_cart.length,
      subtotal: productCarts.reduce((prev, curr) => prev + curr.subtotal, 0),
      total_discount: productCarts.reduce(
        (prev, curr) => prev + curr.discount_amount,
        0
      ),
      total: productCarts.reduce((prev, curr) => prev + curr.total, 0),
    });
    return await this.cartRepository.getById(cartId, {});
  }
}
