import { IOrderRepository } from '@models/order/order.interface';
import {
  OrderConditionDTO,
  OrderCreateDTO,
  OrderUpdateDTO,
} from '@models/order/order.dto';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { Sequelize, where } from 'sequelize';
import { Order } from '@models/order/order.model';
import {
  productModelName,
  productOrderModelName,
  ProductOrderPersistence,
  ProductPersistence,
} from 'src/infras/repository/product/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';

export class PostgresOrderRepository implements IOrderRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getById(id: string, condition: OrderConditionDTO): Promise<Order> {
    const order = await this.sequelize.models[this.modelName].findByPk(id, {
      include: [
        {
          model: ProductPersistence,
          as: productModelName,
          attributes: { exclude: EXCLUDE_ATTRIBUTES },
          through: {
            attributes: ['quantity', 'subtotal'],
          },
        },
      ],
    });
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
      where: condition,
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: ProductPersistence,
          as: productModelName,
          attributes: { exclude: EXCLUDE_ATTRIBUTES },
          through: {
            attributes: ['quantity', 'subtotal'],
          },
        },
      ],
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
    const { product_orders, ...rest } = data;
    const payload = {
      ...rest,
      product: product_orders.map((item) => ({
        id: item.product_id,
        [productOrderModelName]: {
          quantity: item.quantity,
          subtotal: item.subtotal,
        },
      })),
    };
    console.log(payload);
    const order: any = await this.sequelize.models[this.modelName].create(
      data,
      {
        returning: true,
        include: [ProductPersistence],
      }
    );
    console.log(order);
    //   through: {
    //     quantity: product_orders.quantity,
    //     subtotal: product_orders.subtotal,
    //   },
    // });
    return order.dataValues;
  }
  async update(id: string, data: OrderUpdateDTO): Promise<Order> {
    const order = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return order[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    const order = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
