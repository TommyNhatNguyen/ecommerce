import { PaymentConditionDTO, PaymentUpdateDTO, PaymentCreateDTO } from "@models/payment/payment.dto";
import { Payment } from "@models/payment/payment.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export interface IPaymentUseCase {
  getPaymentById(id:string):Promise<Payment | null>
  getPayments(paging: PagingDTO,condition:PaymentConditionDTO):Promise<ListResponse<Payment[]>>
  createPayment(payment:PaymentCreateDTO):Promise<Payment>
  updatePayment(id: string,payment:PaymentUpdateDTO):Promise<Payment>
  deletePayment(id:string):Promise<boolean> 
}

export interface IPaymentRepository extends IQueryRepository, ICommandRepository {}

export interface IQueryRepository {
  getPaymentById(id:string):Promise<Payment | null>
  getPayments(paging: PagingDTO,condition:PaymentConditionDTO):Promise<ListResponse<Payment[]>>
}

export interface ICommandRepository {
  createPayment(payment:PaymentCreateDTO):Promise<Payment>
  updatePayment(id: string, payment:PaymentUpdateDTO):Promise<Payment>
  deletePayment(id:string):Promise<boolean> 
}