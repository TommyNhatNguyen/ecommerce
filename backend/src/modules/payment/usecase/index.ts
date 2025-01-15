import { PaymentUpdateDTO } from 'src/modules/payment/models/payment.dto';
import { PaymentCreateDTO } from 'src/modules/payment/models/payment.dto';
import { PaymentConditionDTO } from 'src/modules/payment/models/payment.dto';
import { IPaymentRepository } from 'src/modules/payment/models/payment.interface';
import { IPaymentUseCase } from 'src/modules/payment/models/payment.interface';
import { Payment } from 'src/modules/payment/models/payment.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PaymentUseCase implements IPaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}
  getPaymentById(id: string): Promise<Payment | null> {
    return this.paymentRepository.getPaymentById(id);
  }
  getPayments(
    paging: PagingDTO,
    condition: PaymentConditionDTO
  ): Promise<ListResponse<Payment[]>> {
    return this.paymentRepository.getPayments(paging, condition);
  }
  createPayment(payment: PaymentCreateDTO): Promise<Payment> {
    return this.paymentRepository.createPayment(payment);
  }
  updatePayment(id: string, payment: PaymentUpdateDTO): Promise<Payment> {
    return this.paymentRepository.updatePayment(id, payment);
  }
  deletePayment(id: string): Promise<boolean> {
    return this.paymentRepository.deletePayment(id);
  }
}
