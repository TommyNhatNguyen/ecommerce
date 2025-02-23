import {
  DiscountConditionDTO,
  DiscountCreateDTO,
  DiscountUpdateDTO,
} from 'src/modules/discount/models/discount.dto';
import {
  Discount,
  DiscountScope,
} from 'src/modules/discount/models/discount.model';
import {
  IDiscountRepository,
  IDiscountUseCase,
} from 'src/modules/discount/models/discount.interface';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { DISCOUNT_AMOUNT_ERROR } from 'src/modules/discount/models/discount.error';
import { Transaction } from 'sequelize';
import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';
import { DiscountCalculatorUsecaseImpl } from 'src/modules/order_detail/usecase/DiscountCalculatorUsecase';

export class DiscountUseCase implements IDiscountUseCase {
  constructor(
    private readonly repository: IDiscountRepository,
    private readonly productSellableUseCase?: IProductSellableUseCase
  ) {}
  async listDiscount(
    paging: PagingDTO,
    condition: DiscountConditionDTO
  ): Promise<ListResponse<Discount[]>> {
    return await this.repository.list(paging, condition);
  }
  async getDiscount(id: string): Promise<Discount | null> {
    return await this.repository.get(id);
  }
  async createDiscount(
    data: Omit<
      DiscountCreateDTO,
      | 'has_max_discount_count'
      | 'is_require_product_count'
      | 'is_require_order_amount'
    >
  ): Promise<Discount> {
    const payload: DiscountCreateDTO = {
      ...data,
    };
    if (data.is_free) {
      payload.amount = 100;
      payload.is_fixed = false;
    }
    if (!data.is_fixed && data.amount > 100) {
      throw DISCOUNT_AMOUNT_ERROR;
    }
    if (data.max_discount_count && data.max_discount_count > 0) {
      payload.has_max_discount_count = true;
    }
    if (data.require_product_count && data.require_product_count > 0) {
      payload.is_require_product_count = true;
    }
    if (data.require_order_amount && data.require_order_amount > 0) {
      payload.is_require_order_amount = true;
    }
    return await this.repository.insert(payload);
  }
  async updateDiscount(
    id: string,
    data: DiscountUpdateDTO,
    t?: Transaction
  ): Promise<Discount> {
    // Update discount
    const updatedDiscount = await this.repository.update(id, data, t);
    // Update product_sellable total_discount and price_after_discounts
    await this.productSellableUseCase?.updateProductSellableDiscounts(t);
    return updatedDiscount;
  }
  async deleteDiscount(id: string, t?: Transaction): Promise<boolean> {
    // Delete discount
    await this.repository.delete(id, t);
    // Update product_sellable total_discount and price_after_discounts
    await this.productSellableUseCase?.updateProductSellableDiscounts(t);
    return true;
  }
}
