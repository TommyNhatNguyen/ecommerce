import { IOrderRepository } from 'src/modules/order/models/order.interface';
import {
  OrderConditionDTO,
  OrderCreateDTO,
  OrderUpdateDTO,
} from 'src/modules/order/models/order.dto';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { Sequelize } from 'sequelize';
import { Order } from 'src/modules/order/models/order.model';
export class PostgresOrderRepository implements IOrderRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getById(id: string, condition: OrderConditionDTO): Promise<Order> {
    const order = await this.sequelize.models[this.modelName].findByPk(id);
    return order?.dataValues || null;
  }
  async getList(
    paging: PagingDTO,
    condition: OrderConditionDTO
  ): Promise<ListResponse<Order[]>> {
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
  async create(data: OrderCreateDTO): Promise<Order> {
    const order: any = await this.sequelize.models[this.modelName].create(
      data,
      {
        returning: true,
      }
    );
    return order.dataValues;
  }
  async update(id: string, data: OrderUpdateDTO): Promise<Order> {
    const order: any = await this.sequelize.models[this.modelName].update(
      data,
      {
        where: { id },
        returning: true,
      }
    );
    return order[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    const order = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
