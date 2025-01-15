import { Sequelize } from 'sequelize';
import {
  PaymentConditionDTO,
  PaymentCreateDTO,
  PaymentUpdateDTO,
} from 'src/modules/payment/models/payment.dto';
import { IPaymentRepository } from 'src/modules/payment/models/payment.interface';
import { Payment } from 'src/modules/payment/models/payment.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresPaymentRepository implements IPaymentRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getPaymentById(id: string): Promise<Payment | null> {
    const payment = await this.sequelize.models[this.modelName].findByPk(id);
    return payment?.dataValues;
  }
  async getPayments(
    paging: PagingDTO,
    condition: PaymentConditionDTO
  ): Promise<ListResponse<Payment[]>> {
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: condition,
      limit,
      offset: (page - 1) * limit,
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        limit,
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async createPayment(payment: PaymentCreateDTO): Promise<Payment> {
    const newPayment = await this.sequelize.models[this.modelName].create(
      payment,
      { returning: true }
    );
    return newPayment.dataValues;
  }
  async updatePayment(id: string, payment: PaymentUpdateDTO): Promise<Payment> {
    const updatedPayment = await this.sequelize.models[this.modelName].update(
      payment,
      { where: { id }, returning: true }
    );
    return updatedPayment[1][0].dataValues;
  }
  async deletePayment(id: string): Promise<boolean> {
    const deletedPayment = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
