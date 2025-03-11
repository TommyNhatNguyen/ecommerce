import { Transaction } from 'sequelize';
import { PaymentConditionDTO } from 'src/modules/payment/models/payment.dto';
import { PaymentUpdateDTO } from 'src/modules/payment/models/payment.dto';
import { PaymentCreateDTO } from 'src/modules/payment/models/payment.dto';
import { Payment } from 'src/modules/payment/models/payment.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IPaymentUseCase {
  getPaymentById(id: string): Promise<Payment | null>;
  getPayments(
    paging: PagingDTO,
    condition: PaymentConditionDTO
  ): Promise<ListResponse<Payment[]>>;
  createPayment(payment: PaymentCreateDTO, t?: Transaction): Promise<Payment>;
  updatePayment(id: string, payment: PaymentUpdateDTO, t?: Transaction): Promise<Payment>;
  deletePayment(id: string): Promise<boolean>;
}

export interface IPaymentRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  getPaymentById(id: string): Promise<Payment | null>;
  getPayments(
    paging: PagingDTO,
    condition: PaymentConditionDTO
  ): Promise<ListResponse<Payment[]>>;
}

export interface ICommandRepository {
  createPayment(payment: PaymentCreateDTO, t?: Transaction): Promise<Payment>;
  updatePayment(id: string, payment: PaymentUpdateDTO, t?: Transaction): Promise<Payment>;
  deletePayment(id: string): Promise<boolean>;
}
