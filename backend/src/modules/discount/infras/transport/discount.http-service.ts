import { Request, Response } from 'express';
import { PagingDTOSchema } from 'src/share/models/paging';
import { IDiscountUseCase } from 'src/modules/discount/models/discount.interface';
import {
  DiscountConditionDTOSchema,
  DiscountCreateDTOSchema,
  DiscountUpdateDTOSchema,
} from 'src/modules/discount/models/discount.dto';

export class DiscountHttpService {
  constructor(private readonly useCase: IDiscountUseCase) {}

  async getDiscount(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const discount = await this.useCase.getDiscount(id);
      if (!discount) {
        res.status(404).json({ message: 'Discount not found' });
        return;
      }
      res
        .status(200)
        .json({ ...discount, message: 'Discount fetched successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  async listDiscount(req: Request, res: Response) {
    const {
      success: pagingSuccess,
      data: pagingData,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: conditionSuccess,
      data: conditionData,
      error: conditionError,
    } = DiscountConditionDTOSchema.safeParse(req.body);
    if (!pagingSuccess || !conditionSuccess) {
      res.status(400).json({ message: 'Invalid paging or condition' });
      return;
    }
    try {
      const discounts = await this.useCase.listDiscount(
        pagingData,
        conditionData
      );
      if (!discounts) {
        res.status(404).json({ message: 'Discounts not found' });
        return;
      }
      res
        .status(200)
        .json({ ...discounts, message: 'Discounts fetched successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  async createDiscount(req: Request, res: Response) {
    const { success, data, error } = DiscountCreateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    const payload = {
      ...data,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
    };
    try {
      const discount = await this.useCase.createDiscount(payload);
      res
        .status(201)
        .json({ ...discount, message: 'Discount created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  async updateDiscount(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = DiscountUpdateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const selectedDiscount = await this.useCase.getDiscount(id);
      if (!selectedDiscount) {
        res.status(404).json({ message: 'Discount not found' });
        return;
      }
      const discount = await this.useCase.updateDiscount(id, data);
      res
        .status(200)
        .json({ ...discount, message: 'Discount updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deleteDiscount(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const selectedDiscount = await this.useCase.getDiscount(id);
      if (!selectedDiscount) {
        res.status(404).json({ message: 'Discount not found' });
        return;
      }
      await this.useCase.deleteDiscount(id);
      res.status(200).json({
        message: 'Discount deleted successfully',
        ...selectedDiscount,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
