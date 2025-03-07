import { Transaction } from 'sequelize';
import {
  CouponConditionDTO,
  CouponCreateDTO,
  CouponUpdateDTO,
} from 'src/modules/coupon/models/coupon.dto';
import { COUPON_NOT_FOUND_ERROR } from 'src/modules/coupon/models/coupon.error';
import {
  ICouponRepository,
  ICouponUseCase,
} from 'src/modules/coupon/models/coupon.interface';
import { Coupon } from 'src/modules/coupon/models/coupon.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class CouponUseCase implements ICouponUseCase {
  constructor(private readonly couponRepository: ICouponRepository) {}
  async listCoupon(
    paging: PagingDTO,
    condition?: CouponConditionDTO
  ): Promise<ListResponse<Coupon[]>> {
    return this.couponRepository.list(paging, condition);
  }
  async getCoupon(
    id: string,
    condition?: CouponConditionDTO
  ): Promise<Coupon | null> {
    return this.couponRepository.get(id, condition);
  }
  async createCoupon(data: CouponCreateDTO, t?: Transaction): Promise<Coupon> {
    return this.couponRepository.insert(data, t);
  }
  async updateCoupon(
    id: string,
    data: CouponUpdateDTO,
    t?: Transaction
  ): Promise<Coupon> {
    const updatedCoupon = await this.getCoupon(id);
    if (!updatedCoupon) {
      throw COUPON_NOT_FOUND_ERROR;
    }
    return this.couponRepository.update(id, data, t);
  }
  async deleteCoupon(id: string, t?: Transaction): Promise<boolean> {
    const deletedCoupon = await this.getCoupon(id);
    if (!deletedCoupon) {
      throw COUPON_NOT_FOUND_ERROR;
    }
    return this.couponRepository.delete(id, t);
  }
}
