import { CartProductSellableSchema } from './../models/cart.model';
import { ListResponse, ModelStatus } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { ICartUseCase } from 'src/modules/cart/models/cart.interface';
import { ICartRepository } from 'src/modules/cart/models/cart.interface';
import {
  CartAddNewProductsDTO,
  CartAddProductsSellableDTO,
  CartConditionDTO,
  CartCreateDTO,
  CartUpdateDTO,
  CartUpdateProductDTO,
  CartUpdateProductSellableDTO,
} from 'src/modules/cart/models/cart.dto';
import { Cart } from 'src/modules/cart/models/cart.model';
import { CART_PRODUCT_ERROR } from 'src/modules/cart/models/cart.error';
import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';
import { Transaction } from 'sequelize';

export class CartUseCase implements ICartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly cartProductRepository: ICartRepository,
    private readonly productSellableUseCase: IProductSellableUseCase
  ) {}
  async updateProductOnCart(
    products_cart: CartUpdateProductDTO,
    condition: CartConditionDTO
  ): Promise<Cart> {
    // Lấy cart
    const cart = await this.cartRepository.getById(products_cart.cart_id, {
      ...condition,
      include_products: true,
    });
    const { product_sellable } = cart;
    // Kiểm tra item đã có trong cart chưa
    const updated_product_cart =
      product_sellable?.find((product) => product.id == products_cart.id) ||
      undefined;
    // Chưa có thì tạo mới
    if (!updated_product_cart) {
      await this.addProductsToCart(products_cart);
    } else {
      // Có rồi thì update
      const updated_product: CartUpdateProductSellableDTO = {
        cart_id: products_cart.cart_id,
        product_sellable_id: products_cart.id,
        quantity:
          (updated_product_cart.cart_product_sellable?.quantity || 0) +
          products_cart.quantity,
        subtotal:
          (updated_product_cart.cart_product_sellable?.subtotal || 0) +
          products_cart.quantity * updated_product_cart.price,
        discount_amount:
          (updated_product_cart.cart_product_sellable?.discount_amount || 0) +
          products_cart.quantity * updated_product_cart.total_discounts,
        total:
          (updated_product_cart.cart_product_sellable?.total || 0) +
          products_cart.quantity * updated_product_cart.price_after_discounts,
      };
      const updatedResponse = await this.cartProductRepository.updateProducts(
        updated_product
      );
      console.log('🚀 ~ CartUseCase ~ updated_product:', updated_product);
      // Update lại cart tổng
      const data = await this.cartRepository.update(products_cart.cart_id, {
        product_quantity: cart.product_quantity + products_cart.quantity,
        subtotal:
          cart.subtotal + products_cart.quantity * updated_product_cart.price,
        total_discount:
          cart.total_discount +
          products_cart.quantity * updated_product_cart.total_discounts,
        total:
          cart.total +
          products_cart.quantity * updated_product_cart.price_after_discounts,
      });
      console.log('🚀 ~ CartUseCase ~ data:', data);
    }

    return await this.cartRepository.getById(products_cart.cart_id, {});
  }
  async getById(id: string, condition: CartConditionDTO, t?: Transaction): Promise<Cart> {
    if (t) {
      return await this.cartRepository.getById(id, condition, t);
    }
    return await this.cartRepository.getById(id, condition);
  }
  async getList(
    paging: PagingDTO,
    condition: CartConditionDTO
  ): Promise<ListResponse<Cart[]>> {
    return await this.cartRepository.getList(paging, condition);
  }
  async create(data: CartCreateDTO, t?: Transaction): Promise<Cart> {
    return await this.cartRepository.create(data, t);
  }
  async update(id: string, data: CartUpdateDTO): Promise<Cart> {
    return await this.cartRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.cartRepository.delete(id);
  }
  async addProductsToCart(products_cart: CartAddNewProductsDTO): Promise<Cart> {
    const cart = await this.cartRepository.getById(products_cart.cart_id, {
      include_products: true,
    });
    // --- PRODUCTS ---
    if (!!!products_cart) throw CART_PRODUCT_ERROR;
    const productSellable =
      await this.productSellableUseCase.getProductSellableById(
        products_cart.id
      );
    const product_data: CartAddProductsSellableDTO = {
      cart_id: products_cart.cart_id,
      product_sellable_id: products_cart.id,
      quantity: products_cart.quantity,
      subtotal: 0,
      discount_amount: 0,
      total: 0,
    };

    let price = productSellable?.price || 0;
    let discount = productSellable?.total_discounts || 0;
    let price_after_discount = productSellable?.price_after_discounts || 0;
    product_data.subtotal = price * product_data.quantity;
    product_data.discount_amount = discount * product_data.quantity;
    product_data.total = price_after_discount * product_data.quantity;
    await this.cartProductRepository.addProducts(product_data);
    const data = await this.cartRepository.update(products_cart.cart_id, {
      product_quantity: cart.product_quantity + product_data.quantity,
      product_count: cart.product_count + 1,
      subtotal: cart.subtotal + product_data.subtotal,
      total_discount: cart.total_discount + product_data.discount_amount,
      total: cart.total + product_data.total,
    });
    return data;
  }
}
