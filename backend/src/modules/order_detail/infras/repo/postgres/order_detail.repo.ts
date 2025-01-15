import { Sequelize } from 'sequelize';
import {
  OrderDetailConditionDTO,
  OrderDetailCreateDTO,
  OrderDetailUpdateDTO,
} from 'src/modules/order_detail/models/order_detail.dto';
import { IOrderDetailRepository } from 'src/modules/order_detail/models/order_detail.interface';
import { OrderDetail } from 'src/modules/order_detail/models/order_detail.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresOrderDetailRepository implements IOrderDetailRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getById(
    id: string,
    condition: OrderDetailConditionDTO
  ): Promise<OrderDetail> {
    const order = await this.sequelize.models[this.modelName].findByPk(id);
    return order?.dataValues || null;
  }
  async getList(
    paging: PagingDTO,
    condition: OrderDetailConditionDTO
  ): Promise<ListResponse<OrderDetail[]>> {
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      // where: condition,
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        current_page: page,
        limit,
        total_count: count,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async create(data: OrderDetailCreateDTO): Promise<OrderDetail> {
    const order = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return order.dataValues;
  }
  async update(id: string, data: OrderDetailUpdateDTO): Promise<OrderDetail> {
    const order = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return order[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
