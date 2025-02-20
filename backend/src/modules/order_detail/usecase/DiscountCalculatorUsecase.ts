import { IDiscountUseCase } from 'src/modules/discount/models/discount.interface';
import { Discount } from 'src/modules/discount/models/discount.model';
import { DiscountUseCase } from 'src/modules/discount/usecase';

abstract class DiscountCalculatorUsecase {
  protected discount: Discount;
  protected discountUseCase: IDiscountUseCase;
  constructor(discount: Discount, discountUseCase: IDiscountUseCase) {
    this.discount = discount;
    this.discountUseCase = discountUseCase;
  }
  abstract maxDiscountCountAmount(quantity: number, price: number): number;
  abstract requireProductCountAmount(
    quantity: number,
    price: number,
    hasMaxDiscountCount: boolean
  ): number;
  abstract requireOrderAmount(
    orderAmount: number,
    hasMaxDiscountCount: boolean,
    hasRequireOrderAmount: boolean,
    totalProductQuantityInOrder: number
  ): number;
  abstract updateDiscountCount(
    discountId: string,
    discountCount: number
  ): boolean;
}

export class DiscountCalculatorUsecaseImpl extends DiscountCalculatorUsecase {
  constructor(discount: Discount, discountUseCase: IDiscountUseCase) {
    super(discount, discountUseCase);
  }
  maxDiscountCountAmount(quantity: number, price: number): number {
    const remainingDiscountCount =
      (this.discount.max_discount_count ?? 0) -
      (this.discount.discount_count ?? 0);
    const applyQuantity = Math.min(quantity, remainingDiscountCount);

    if (applyQuantity <= 0) return 0;

    const applyDiscountAmount = this.calculateDiscountAmount(
      applyQuantity,
      price
    );
    this.updateDiscountCount(
      this.discount.id,
      applyQuantity + (this.discount.discount_count ?? 0)
    );

    return applyDiscountAmount;
  }
  requireProductCountAmount(
    quantity: number,
    price: number,
    hasMaxDiscountCount: boolean
  ): number {
    const applyQuantity = Math.floor(
      quantity / (this.discount.require_product_count ?? 0)
    );

    if (hasMaxDiscountCount) {
      return this.maxDiscountCountAmount(applyQuantity, price);
    }

    return this.calculateDiscountAmount(applyQuantity, price);
  }
  requireOrderAmount(
    orderAmount: number,
    hasMaxDiscountCount: boolean,
    hasRequireOrderAmount: boolean,
    totalProductQuantityInOrder: number
  ): number {
    const isAbleToApplyDiscount =
      totalProductQuantityInOrder >= (this.discount.require_product_count ?? 0);

    if (hasMaxDiscountCount) {
      if (hasRequireOrderAmount && isAbleToApplyDiscount) {
        return this.requireProductCountAmount(1, orderAmount, true);
      }
      return this.maxDiscountCountAmount(1, orderAmount);
    }

    return this.calculateDiscountAmount(1, orderAmount);
  }
  calculateDiscountAmount(quantity: number, price: number): number {
    return this.discount.is_fixed
      ? quantity * this.discount.amount
      : quantity * price * (this.discount.amount / 100);
  }
  updateDiscountCount(discountId: string, discountCount: number): boolean {
    return !!this.discountUseCase.updateDiscount(discountId, {
      discount_count: discountCount,
    });
  }
}
