import { Request, Response } from 'express';
import { PagingDTO, PagingDTOSchema } from 'src/share/models/paging';
import {
  CouponConditionDTO,
  CouponConditionDTOSchema,
  CouponCreateDTOSchema,
  CouponUpdateDTOSchema,
} from 'src/modules/coupon/models/coupon.dto';
import { ICouponUseCase } from 'src/modules/coupon/models/coupon.interface';

export class CouponHttpService {
  constructor(private readonly couponUseCase: ICouponUseCase) {}
  async getListCoupon(req: Request, res: Response) {
    const {
      success: pagingSuccess,
      data: pagingData,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: conditionSuccess,
      data: conditionData,
      error: conditionError,
    } = CouponConditionDTOSchema.safeParse(req.query);
    if (!pagingSuccess || !conditionSuccess) {
      res.status(400).json({ message: 'Invalid paging or condition' });
      return;
    }
    try {
      const coupons = await this.couponUseCase.listCoupon(
        pagingData,
        conditionData
      );
      if (!coupons) {
        res.status(404).json({ message: 'Coupons not found' });
        return;
      }
      res
        .status(200)
        .json({ ...coupons, message: 'Coupons fetched successfully' });
    } catch (error) {
      console.log("🚀 ~ CouponHttpService ~ getListCoupon ~ error:", error)
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getCoupon(req: Request, res: Response) {
    const { id } = req.params;
    const {
      success: couponSuccess,
      data: couponCondition,
      error: couponError,
    } = CouponConditionDTOSchema.safeParse(req.query);
    if (!couponSuccess) {
      res.status(400).json({ message: 'Invalid coupon' });
      return;
    }
    try {
      const coupon = await this.couponUseCase.getCoupon(id, couponCondition);
      if (!coupon) {
        res.status(404).json({ message: 'Coupon not found' });
        return;
      }
      res
        .status(200)
        .json({ ...coupon, message: 'Coupon fetched successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createCoupon(req: Request, res: Response) {
    const {
      success: couponSuccess,
      data: couponData,
      error: couponError,
    } = CouponCreateDTOSchema.safeParse(req.body);
    if (!couponSuccess) {
      res.status(400).json({ message: 'Invalid coupon' });
      return;
    }
    try {
      const coupon = await this.couponUseCase.createCoupon(couponData);
      res
        .status(200)
        .json({ ...coupon, message: 'Coupon created successfully' });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updateCoupon(req: Request, res: Response) {
    const { id } = req.params;
    const {
      success: couponSuccess,
      data: couponData,
      error: couponError,
    } = CouponUpdateDTOSchema.safeParse(req.body);
    if (!couponSuccess) {
      res.status(400).json({ message: 'Invalid coupon' });
      return;
    }
    try {
      const coupon = await this.couponUseCase.updateCoupon(id, couponData);
      res
        .status(200)
        .json({ ...coupon, message: 'Coupon updated successfully' });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deleteCoupon(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const isDeleted = await this.couponUseCase.deleteCoupon(id);
      res.status(200).json({ message: 'Coupon deleted successfully' });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
