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
    quantity: number,
    noUpdateDiscountCount?: boolean
  ): Promise<number>;
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
    price: number,
    noUpdateDiscountCount?: boolean
  ): Promise<number>;
  abstract calculateDiscountAmountForOrder(
    quantity: number,
    orderAmount: number,
    totalProductQuantity: number,
    noUpdateDiscountCount?: boolean
  ): Promise<number>;
  abstract calculateDiscountAmount(quantity: number, price: number): number;
  abstract updateDiscountCount(
    discountId: string,
    discountCount: number
  ): Promise<boolean>;
}

export class DiscountCalculatorUsecaseImpl extends DiscountCalculatorUsecase {
  constructor(discount: Discount, discountUseCase: IDiscountUseCase) {
    super(discount, discountUseCase);
  }

  async applyMaxDiscountCount(
    hasMaxDiscountCount: boolean,
    quantity: number,
    noUpdateDiscountCount?: boolean
  ): Promise<number> {
    if (hasMaxDiscountCount) {
      const remainingDiscountCount =
        this.discount.max_discount_count - this.discount.discount_count;
      let applyQuantity = Math.min(quantity, remainingDiscountCount);
      console.log("🚀 ~ DiscountCalculatorUsecaseImpl ~ applyQuantity:", applyQuantity)
      if (applyQuantity > 0 && !noUpdateDiscountCount) {
        await this.updateDiscountCount(
          this.discount.id,
          this.discount.discount_count + applyQuantity
        );
        console.log('this.discount.discount_count', applyQuantity);
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

  async calculateDiscountAmountForProduct(
    quantity: number,
    price: number,
    noUpdateDiscountCount?: boolean
  ): Promise<number> {
    let applyQuantity = await this.applyMaxDiscountCount(
      this.discount.has_max_discount_count,
      this.applyMinProductCount(
        this.discount.is_require_product_count,
        quantity
      ),
      noUpdateDiscountCount
    );
    return this.calculateDiscountAmount(applyQuantity, price);
  }

  async calculateDiscountAmountForOrder(
    quantity: number,
    orderAmount: number,
    totalProductQuantity: number,
    noUpdateDiscountCount?: boolean
  ): Promise<number> {
    let applyQuantity = await this.applyMaxDiscountCount(
      this.discount.has_max_discount_count,
      this.applyMinProductCountInOrder(
        this.discount.is_require_product_count,
        totalProductQuantity,
        this.applyMinDiscountAmount(
          this.discount.is_require_order_amount,
          orderAmount,
          quantity
        )
      ),
      noUpdateDiscountCount
    );
    return this.calculateDiscountAmount(applyQuantity, orderAmount);
  }

  calculateDiscountAmount(quantity: number, price: number): number {
    return this.discount.is_fixed
      ? quantity * this.discount.amount
      : quantity * price * (this.discount.amount / 100);
  }

  async updateDiscountCount(
    discountId: string,
    discountCount: number
  ): Promise<boolean> {
    return !!(await this.discountUseCase.updateDiscount(discountId, {
      discount_count: discountCount,
    }));
  }
}
