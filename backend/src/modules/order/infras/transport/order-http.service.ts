import {
  OrderConditionDTOSchema,
  OrderCreateDTO,
  OrderCreateDTOSchema,
  OrderUpdateDTOSchema,
} from 'src/modules/order/models/order.dto';
import { IOrderUseCase } from 'src/modules/order/models/order.interface';
import { Request, Response } from 'express';
import { PagingDTOSchema } from 'src/share/models/paging';
import { verify } from 'jsonwebtoken';

export class OrderHttpService {
  constructor(private readonly orderUseCase: IOrderUseCase) {}

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = OrderConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const order = await this.orderUseCase.getById(id, data);
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }
      res.status(200).json({ success: true, ...order });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async getList(req: Request, res: Response) {
    const {
      success: successCondition,
      data: dataCondition,
      error: errorCondition,
    } = OrderConditionDTOSchema.safeParse(req.query);
    const {
      success: successPaging,
      data: dataPaging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    if (!successCondition || !successPaging) {
      res.status(400).json({
        success: false,
        message:
          errorCondition?.message || errorPaging?.message || 'Invalid request',
      });
      return;
    }
    const paging = {
      page: dataPaging.page,
      limit: dataPaging.limit,
    };
    try {
      const orders = await this.orderUseCase.getList(paging, dataCondition);
      if (!orders) {
        res.status(404).json({ success: false, message: 'Orders not found' });
        return;
      }
      res.status(200).json({ success: true, ...orders });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async create(req: Request, res: Response) {
    const { success, data, error } = OrderCreateDTOSchema.omit({
      order_detail_id: true,
      actor: true,
    }).safeParse(req.body);
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const order = await this.orderUseCase.create({
        ...data,
        actor: req.actor,
      });
      if (!order) {
        res
          .status(400)
          .json({ success: false, message: 'Failed to create order' });
        return;
      }
      res.status(200).json({ success: true, data: order });
    } catch (error: any) {
      res
        .status(400)
        .json({ success: false, message: error.message });
      return;
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = OrderUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const order = await this.orderUseCase.update(id, data);
      if (!order) {
        res
          .status(400)
          .json({ success: false, message: 'Failed to update order' });
        return;
      }
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const order = await this.orderUseCase.delete(id);
      if (!order) {
        res
          .status(400)
          .json({ success: false, message: 'Failed to delete order' });
        return;
      }
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }
}
