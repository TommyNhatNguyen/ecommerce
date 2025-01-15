import { OrderDetailUseCase } from 'src/modules/order_detail/usecase';
import { Request, Response } from 'express';
import {
  OrderDetailConditionDTOSchema,
  OrderDetailCreateDTOSchema,
  OrderDetailUpdateDTOSchema,
} from 'src/modules/order_detail/models/order_detail.dto';
import { PagingDTOSchema } from 'src/share/models/paging';
export class OrderDetailHttpService {
  constructor(private readonly orderDetailUsecase: OrderDetailUseCase) {}

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = OrderDetailConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const orderDetail = await this.orderDetailUsecase.getById(id, data);
      if (!orderDetail) {
        res
          .status(404)
          .json({ success: false, message: 'Order detail not found' });
        return;
      }
      res.status(200).json({ success: true, ...orderDetail });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async getList(req: Request, res: Response) {
    const {
      success: successPaging,
      data: dataPaging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: successCondition,
      data: dataCondition,
      error: errorCondition,
    } = OrderDetailConditionDTOSchema.safeParse(req.query);
    if (!successPaging || !successCondition) {
      res.status(400).json({
        success: false,
        message: errorPaging?.message || errorCondition?.message,
      });
      return;
    }
    try {
      const orderDetail = await this.orderDetailUsecase.getList(
        dataPaging,
        dataCondition
      );
      if (!orderDetail) {
        res
          .status(404)
          .json({ success: false, message: 'Order detail not found' });
        return;
      }
      res.status(200).json({ success: true, ...orderDetail });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async create(req: Request, res: Response) {
    const { success, data, error } = OrderDetailCreateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const orderDetail = await this.orderDetailUsecase.create(data);
      res.status(200).json({ success: true, ...orderDetail });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = OrderDetailUpdateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const updatedOrderDetail = await this.orderDetailUsecase.getById(id, {});
      if (!updatedOrderDetail) {
        res
          .status(404)
          .json({ success: false, message: 'Order detail not found' });
        return;
      }
      const orderDetail = await this.orderDetailUsecase.update(id, data);
      res.status(200).json({ success: true, ...orderDetail });
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
      const deletedOrderDetail = await this.orderDetailUsecase.getById(id, {});
      if (!deletedOrderDetail) {
        res
          .status(404)
          .json({ success: false, message: 'Order detail not found' });
        return;
      }
      await this.orderDetailUsecase.delete(id);
      res.status(200).json({
        success: true,
        message: 'Order detail deleted successfully',
        ...deletedOrderDetail,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }
}
