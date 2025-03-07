import { Transaction } from 'sequelize';
import {
  CouponConditionDTO,
  CouponCreateDTO,
  CouponUpdateDTO,
} from 'src/modules/coupon/models/coupon.dto';
import { Coupon } from 'src/modules/coupon/models/coupon.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface ICouponUseCase {
  listCoupon(
    paging: PagingDTO,
    condition?: CouponConditionDTO
  ): Promise<ListResponse<Coupon[]>>;
  getCoupon(id: string, condition?: CouponConditionDTO): Promise<Coupon | null>;
  createCoupon(data: CouponCreateDTO, t?: Transaction): Promise<Coupon>;
  updateCoupon(
    id: string,
    data: CouponUpdateDTO,
    t?: Transaction
  ): Promise<Coupon>;
  deleteCoupon(id: string, t?: Transaction): Promise<boolean>;
}

export interface ICouponRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  list(
    paging: PagingDTO,
    condition?: CouponConditionDTO
  ): Promise<ListResponse<Coupon[]>>;
  get(id: string, condition?: CouponConditionDTO): Promise<Coupon | null>;
}

export interface ICommandRepository {
  insert(data: CouponCreateDTO, t?: Transaction): Promise<Coupon>;
  update(id: string, data: CouponUpdateDTO, t?: Transaction): Promise<Coupon>;
  delete(id: string, t?: Transaction): Promise<boolean>;
}
