import { IPaymentMethodUseCase } from 'src/modules/payment_method/models/payment_method.interface';
import { IPaymentMethodRepository } from 'src/modules/payment_method/models/payment_method.interface';
import { ListResponse, PaymentMethod } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  IPaymentMethodConditionDTO,
  IPaymentMethodCreateDTO,
  IPaymentMethodUpdateDTO,
} from 'src/modules/payment_method/models/payment_method.dto';
export class PaymentMethodUseCase implements IPaymentMethodUseCase {
  constructor(
    private readonly paymentMethodRepository: IPaymentMethodRepository
  ) {}
  async getById(
    id: string,
    condition?: IPaymentMethodConditionDTO
  ): Promise<PaymentMethod | null> {
    return await this.paymentMethodRepository.getPaymentById(id, condition);
  }
  async getPaymentList(
    paging: PagingDTO,
    condition?: IPaymentMethodConditionDTO
  ): Promise<ListResponse<PaymentMethod[]>> {
    return await this.paymentMethodRepository.getPaymentList(paging, condition);
  }
  async createPayment(data: IPaymentMethodCreateDTO): Promise<PaymentMethod> {
    return await this.paymentMethodRepository.createPayment(data);
  }
  async updatePayment(
    id: string,
    data: IPaymentMethodUpdateDTO
  ): Promise<PaymentMethod> {
    return await this.paymentMethodRepository.updatePayment(id, data);
  }
  async deletePayment(id: string): Promise<boolean> {
    return await this.paymentMethodRepository.deletePayment(id);
  }
}
