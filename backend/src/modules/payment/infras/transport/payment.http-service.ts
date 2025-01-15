import { Request, Response } from 'express';
import { IPaymentUseCase } from 'src/modules/payment/models/payment.interface';
import {
  PaymentConditionDTOSchema,
  PaymentCreateDTOSchema,
  PaymentUpdateDTOSchema,
} from 'src/modules/payment/models/payment.dto';
import { PagingDTOSchema } from 'src/share/models/paging';

export class PaymentHttpService {
  constructor(private readonly paymentUseCase: IPaymentUseCase) {}
  async getPayments(req: Request, res: Response) {
    const {
      success: pagingSuccess,
      data: paging,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: conditionSuccess,
      data: condition,
      error: conditionError,
    } = PaymentConditionDTOSchema.safeParse(req.body);
    if (!pagingSuccess || !conditionSuccess) {
      res.status(400).json({ message: 'Invalid paging or condition' });
      return;
    }
    try {
      const payments = await this.paymentUseCase.getPayments(paging, condition);
      if (payments.data.length === 0) {
        res.status(404).json({ message: 'No payments found' });
        return;
      }
      res.status(200).json({ message: 'Payments found', ...payments });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getPaymentById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const payment = await this.paymentUseCase.getPaymentById(id);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.status(200).json({ message: 'Payment found', ...payment });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createPayment(req: Request, res: Response) {
    const {
      success: paymentSuccess,
      data: payment,
      error: paymentError,
    } = PaymentCreateDTOSchema.safeParse(req.body);
    if (!paymentSuccess) {
      res.status(400).json({ message: 'Invalid payment' });
      return;
    }
    try {
      const newPayment = await this.paymentUseCase.createPayment(payment);
      res.status(201).json({ message: 'Payment created', ...newPayment });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updatePayment(req: Request, res: Response) {
    const { id } = req.params;
    const {
      success: paymentSuccess,
      data: paymentData,
      error: paymentError,
    } = PaymentUpdateDTOSchema.safeParse(req.body);
    if (!paymentSuccess) {
      res.status(400).json({ message: 'Invalid payment' });
      return;
    }
    try {
      const payment = await this.paymentUseCase.getPaymentById(id);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      const updatedPayment = await this.paymentUseCase.updatePayment(
        id,
        paymentData
      );
      res.status(200).json({ message: 'Payment updated', ...updatedPayment });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deletePayment(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const payment = await this.paymentUseCase.getPaymentById(id);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      await this.paymentUseCase.deletePayment(id);
      res.status(200).json({ message: 'Payment deleted', ...payment });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
