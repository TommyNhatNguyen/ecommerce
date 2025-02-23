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
  abstract applyMaxDiscountCount(
    hasMaxDiscountCount: boolean,
    quantity: number
  ): number;
  abstract applyMinProductCount(
    hasRequireProductCount: boolean,
    quantity: number
  ): number;
  abstract applyMinProductCountInOrder(
    hasRequireProductCount: boolean,
    totalProductQuantity: number,
    quantity: number
  ): number;
  abstract applyMinDiscountAmount(
    hasRequireOrderAmount: boolean,
    orderAmount: number,
    quantity: number
  ): number;

  abstract calculateDiscountAmountForProduct(
    quantity: number,
    price: number
  ): number;
  abstract calculateDiscountAmountForOrder(
    quantity: number,
    orderAmount: number,
    totalProductQuantity: number
  ): number;
  abstract calculateDiscountAmount(quantity: number, price: number): number;
  abstract updateDiscountCount(
    discountId: string,
    discountCount: number
  ): boolean;
}

export class DiscountCalculatorUsecaseImpl extends DiscountCalculatorUsecase {
  constructor(discount: Discount, discountUseCase: IDiscountUseCase) {
    super(discount, discountUseCase);
  }

  applyMaxDiscountCount(
    hasMaxDiscountCount: boolean,
    quantity: number
  ): number {
    if (hasMaxDiscountCount) {
      const remainingDiscountCount =
        this.discount.max_discount_count - this.discount.discount_count;
      let applyQuantity = Math.min(quantity, remainingDiscountCount);
      if (applyQuantity > 0) {
        this.updateDiscountCount(
          this.discount.id,
          this.discount.discount_count + applyQuantity
        );
      }
      return applyQuantity;
    } else {
      return quantity;
    }
  }

  applyMinProductCount(
    hasRequireProductCount: boolean,
    quantity: number
  ): number {
    if (hasRequireProductCount) {
      let applyQuantity = Math.floor(
        quantity / (this.discount.require_product_count ?? 0)
      );
      return applyQuantity;
    } else {
      return quantity;
    }
  }

  applyMinProductCountInOrder(
    hasRequireProductCount: boolean,
    totalProductQuantity: number,
    quantity: number
  ): number {
    if (hasRequireProductCount) {
      let isApplicable =
        totalProductQuantity >= this.discount.require_product_count;
      return isApplicable ? quantity : 0;
    } else {
      return quantity;
    }
  }

  applyMinDiscountAmount(
    hasRequireOrderAmount: boolean,
    orderAmount: number,
    quantity: number
  ): number {
    if (hasRequireOrderAmount) {
      let isApplicable = orderAmount >= this.discount.require_order_amount;
      return isApplicable ? quantity : 0;
    } else {
      return quantity;
    }
  }

  calculateDiscountAmountForProduct(quantity: number, price: number): number {
    let applyQuantity = this.applyMaxDiscountCount(
      this.discount.has_max_discount_count,
      this.applyMinProductCount(
        this.discount.is_require_product_count,
        quantity
      )
    );
    return this.calculateDiscountAmount(applyQuantity, price);
  }

  calculateDiscountAmountForOrder(
    quantity: number,
    orderAmount: number,
    totalProductQuantity: number
  ): number {
    let applyQuantity = this.applyMaxDiscountCount(
      this.discount.has_max_discount_count,
      this.applyMinProductCountInOrder(
        this.discount.is_require_product_count,
        totalProductQuantity,
        this.applyMinDiscountAmount(
          this.discount.is_require_order_amount,
          orderAmount,
          quantity
        )
      )
    );
    return this.calculateDiscountAmount(applyQuantity, orderAmount);
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
