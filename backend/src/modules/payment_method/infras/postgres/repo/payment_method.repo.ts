
import { Op, Sequelize } from 'sequelize';
import { ListResponse,  } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { IPaymentMethodRepository } from 'src/modules/payment_method/models/payment_method.interface';
import { IPaymentMethodConditionDTO, IPaymentMethodCreateDTO, IPaymentMethodUpdateDTO } from 'src/modules/payment_method/models/payment_method.dto';
import { PaymentMethodModel } from 'src/modules/payment_method/models/payment_method.model';

export class PostgresPaymentMethodRepository implements IPaymentMethodRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async createPayment(data: IPaymentMethodCreateDTO): Promise<PaymentMethodModel> {
    const payment = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return payment.dataValues;
  }
  async updatePayment(
    id: string,
    data: IPaymentMethodUpdateDTO
  ): Promise<PaymentMethodModel> {

    const payment = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return payment[1][0].dataValues;
  }
  async deletePayment(id: string): Promise<boolean> {
    const payment = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
  async getPaymentById(
    id: string,
    condition: IPaymentMethodConditionDTO
  ): Promise<PaymentMethodModel | null> {
    const where: any = { };
    const { type, minCost, maxCost, status, created_at, updated_at } = condition || {};
    if (type) where.type = type;
    if (minCost) where.cost = { [Op.gte]: minCost };
    if (maxCost) where.cost = { [Op.lte]: maxCost };
    if (status) where.status = status;
    if (created_at) where.created_at = created_at;
    if (updated_at) where.updated_at = updated_at;
    const payment = await this.sequelize.models[this.modelName].findByPk(id, where);

    return payment?.dataValues;
  }
  async getPaymentList(
    paging: PagingDTO,
    condition: IPaymentMethodConditionDTO
  ): Promise<ListResponse<PaymentMethodModel[]>> {
    const { page, limit } = paging;
    const where: any = {};
    if (condition.type) where.type = condition.type;
    if (condition.minCost) where.cost = { [Op.gte]: condition.minCost };
    if (condition.maxCost) where.cost = { [Op.lte]: condition.maxCost };
    if (condition.status) where.status = condition.status;
    if (condition.created_at) where.created_at = condition.created_at;
    if (condition.updated_at) where.updated_at = condition.updated_at;
    const payment = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({ where, limit, offset: (page - 1) * limit });
    return {
      data: payment.rows.map((row) => row.dataValues),
      meta: {
        total_count: payment.count,
        current_page: page,
        total_page: Math.ceil(payment.count / limit),
        limit,
      },
    };
  }
}
