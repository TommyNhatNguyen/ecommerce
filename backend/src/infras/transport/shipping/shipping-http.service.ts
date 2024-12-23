import {
  IShippingConditionDTOSchema,
  IShippingCreateDTOSchema,
  IShippingUpdateDTOSchema,
} from '@models/shipping/shipping.dto';
import { IShippingUseCase } from '@models/shipping/shipping.interface';
import { Request, Response } from 'express';
import { PagingDTOSchema } from 'src/share/models/paging';

export class ShippingHttpService {
  constructor(private readonly shippingUseCase: IShippingUseCase) {}
  async getShippingById(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = IShippingConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const shipping = await this.shippingUseCase.getShippingById(id, data);
      if (!shipping) {
        res.status(404).json({ message: 'Shipping not found' });
        return;
      }
      res.status(200).json(shipping);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getShippingList(req: Request, res: Response) {
    const {
      success: successPaging,
      data: paging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: successCondition,
      data: condition,
      error: errorCondition,
    } = IShippingConditionDTOSchema.safeParse(req.query);
    if (!successPaging || !successCondition) {
      res
        .status(400)
        .json({ message: errorPaging?.message || errorCondition?.message });
      return;
    }
    try {
      const shippingList = await this.shippingUseCase.getShippingList(
        paging,
        condition
      );
      if (!shippingList) {
        res.status(404).json({ message: 'Shipping list not found' });
        return;
      }
      res.status(200).json(shippingList);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createShipping(req: Request, res: Response) {
    const { success, data, error } = IShippingCreateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const shipping = await this.shippingUseCase.createShipping(data);
      if (!shipping) {
        res.status(404).json({ message: 'Shipping not found' });
        return;
      }
      res.status(200).json(shipping);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updateShipping(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = IShippingUpdateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const shipping = await this.shippingUseCase.getShippingById(id);
      if (!shipping) {
        res.status(404).json({ message: 'Shipping not found' });
        return;
      }
      const updatedShipping = await this.shippingUseCase.updateShipping(
        id,
        data
      );
      if (!updatedShipping) {
        res.status(404).json({ message: 'Failed to update shipping' });
        return;
      }
      res.status(200).json(updatedShipping);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deleteShipping(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const shipping = await this.shippingUseCase.getShippingById(id);
      if (!shipping) {
        res.status(404).json({ message: 'Shipping not found' });
        return;
      }
      const deletedShipping = await this.shippingUseCase.deleteShipping(id);
      if (!deletedShipping) {
        res.status(404).json({ message: 'Failed to delete shipping' });
        return;
      }
      res.status(200).json(deletedShipping);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
