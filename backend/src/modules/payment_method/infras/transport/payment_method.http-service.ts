import { Request, Response } from 'express';
import {
  IPaymentMethodConditionDTOSchema,
  IPaymentMethodCreateDTOSchema,
  IPaymentMethodUpdateDTOSchema,
} from 'src/modules/payment_method/models/payment_method.dto';
import { IPaymentMethodUseCase } from 'src/modules/payment_method/models/payment_method.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class PaymentMethodHttpService {
  constructor(private readonly paymentMethodUseCase: IPaymentMethodUseCase) {}
  async getPaymentById(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = IPaymentMethodConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const paymentMethod = await this.paymentMethodUseCase.getById(id, data);
      if (!paymentMethod) {
        res.status(404).json({ message: 'Payment method not found' });
        return;
      }
      res.status(200).json(paymentMethod);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getPaymentList(req: Request, res: Response) {
    const {
      success: successPaging,
      data: paging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: successCondition,
      data: condition,
      error: errorCondition,
    } = IPaymentMethodConditionDTOSchema.safeParse(req.query);
    if (!successPaging || !successCondition) {
      res
        .status(400)
        .json({ message: errorPaging?.message || errorCondition?.message });
      return;
    }
    try {
      const paymentMethodList = await this.paymentMethodUseCase.getPaymentList(
        paging,
        condition
      );
      if (!paymentMethodList) {
        res.status(404).json({ message: 'Payment method list not found' });
        return;
      }
      res.status(200).json(paymentMethodList);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createPayment(req: Request, res: Response) {
    const { success, data, error } = IPaymentMethodCreateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const paymentMethod = await this.paymentMethodUseCase.createPayment(data);
      if (!paymentMethod) {
        res.status(404).json({ message: 'Payment method not found' });
        return;
      }
      res.status(200).json(paymentMethod);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updatePayment(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = IPaymentMethodUpdateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const paymentMethod = await this.paymentMethodUseCase.getById(id);
      if (!paymentMethod) {
        res.status(404).json({ message: 'Payment method not found' });
        return;
      }
      const updatedPaymentMethod =
        await this.paymentMethodUseCase.updatePayment(id, data);
      if (!updatedPaymentMethod) {
        res.status(404).json({ message: 'Failed to update payment method' });
        return;
      }
      res.status(200).json(updatedPaymentMethod);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deletePayment(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const paymentMethod = await this.paymentMethodUseCase.getById(id);
      if (!paymentMethod) {
        res.status(404).json({ message: 'Payment method not found' });
        return;
      }
      const deletedPaymentMethod =
        await this.paymentMethodUseCase.deletePayment(id);
      if (!deletedPaymentMethod) {
        res.status(404).json({ message: 'Failed to delete payment method' });
        return;
      }
      res.status(200).json(deletedPaymentMethod);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
