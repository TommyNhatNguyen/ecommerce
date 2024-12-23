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
import {
  discountModelName,
  DiscountPersistence,
} from 'src/infras/repository/discount/dto';
import {
  customerModelName,
  CustomerPersistence,
} from 'src/infras/repository/customer/dto';

export class PostgresOrderRepository implements IOrderRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getById(id: string, condition: OrderConditionDTO): Promise<Order> {
    const order = await this.sequelize.models[this.modelName].findByPk(id, {
      include: [
        {
          model: CustomerPersistence,
          as: customerModelName,
          attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
        },
        {
          model: ProductPersistence,
          as: productModelName,
          attributes: { exclude: [...EXCLUDE_ATTRIBUTES, 'description'] },
          through: {
            attributes: ['quantity', 'subtotal', 'status'],
            as: 'order_detail',
          },
          include: [
            {
              model: DiscountPersistence,
              as: discountModelName,
              attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
              through: {
                attributes: [],
              },
            },
          ],
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
          model: CustomerPersistence,
          as: customerModelName,
          attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
        },
        {
          model: ProductPersistence,
          as: productModelName,
          attributes: { exclude: [...EXCLUDE_ATTRIBUTES, 'description'] },
          include: [
            {
              model: DiscountPersistence,
              as: discountModelName,
              attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
              through: {
                attributes: [],
              },
            },
          ],
          through: {
            attributes: ['quantity', 'subtotal', 'status'],
            as: 'order_detail',
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
    const transaction = await this.sequelize.transaction();
    try {
      // Create order
      const order: any = await this.sequelize.models[this.modelName].create(
        rest,
        {
          returning: true,
          transaction: transaction,
        }
      );
      await ProductOrderPersistence.bulkCreate(
        product_orders.map((product) => ({
          ...product,
          order_id: order.dataValues.id,
        })),
        {
          returning: true,
          transaction: transaction,
        }
      );
      await transaction.commit();
      return order.dataValues;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async update(id: string, data: OrderUpdateDTO): Promise<Order> {
    const { product_orders, ...rest } = data;
    const payload = {
      ...rest,
      product: product_orders?.map((item) => ({
        id: item.product_id,
        [productOrderModelName]: {
          quantity: item.quantity,
          subtotal: item.subtotal,
        },
      })),
    };
    const order: any = await this.sequelize.models[this.modelName].update(
      payload,
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
