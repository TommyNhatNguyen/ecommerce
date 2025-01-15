import { IShippingCreateDTO } from 'src/modules/shipping/models/shipping.dto';
import { IShippingUpdateDTO } from 'src/modules/shipping/models/shipping.dto';
import { IShippingConditionDTO } from 'src/modules/shipping/models/shipping.dto';
import { Shipping } from 'src/modules/shipping/models/shipping.model';
import { ListResponse, PaymentMethod } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  IPaymentMethodCreateDTO,
  IPaymentMethodUpdateDTO,
  IPaymentMethodConditionDTO,
} from './payment_method.dto';

export interface IPaymentMethodUseCase {
  getById(
    id: string,
    condition?: IPaymentMethodConditionDTO
  ): Promise<PaymentMethod | null>;
  getPaymentList(
    paging: PagingDTO,
    condition?: IPaymentMethodConditionDTO
  ): Promise<ListResponse<PaymentMethod[]>>;
  createPayment(data: IPaymentMethodCreateDTO): Promise<PaymentMethod>;
  updatePayment(
    id: string,
    data: IPaymentMethodUpdateDTO
  ): Promise<PaymentMethod>;
  deletePayment(id: string): Promise<boolean>;
}

export interface IPaymentMethodRepository
  extends ICommandRepository,
    IQueryRepository {}

export interface IQueryRepository {
  getPaymentById(
    id: string,
    condition?: IPaymentMethodConditionDTO
  ): Promise<PaymentMethod | null>;
  getPaymentList(
    paging: PagingDTO,
    condition?: IPaymentMethodConditionDTO
  ): Promise<ListResponse<PaymentMethod[]>>;
}

export interface ICommandRepository {
  createPayment(data: IPaymentMethodCreateDTO): Promise<PaymentMethod>;
  updatePayment(id: string, data: IPaymentMethodUpdateDTO): Promise<PaymentMethod>;
  deletePayment(id: string): Promise<boolean>;
}